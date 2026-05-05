process.on('uncaughtException', (err) => {
    console.error('CRASH:', err.message);
    console.error(err.stack);
});
const cron = require('node-cron');


require("dotenv").config();
const express = require("express");
   
const path =require("path")
const app =express();
const axios = require("axios");
const bodyParser = require("body-parser");
const bcrypt =require("bcryptjs");

const multer = require("multer");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "views"));


const jwt = require("jsonwebtoken");
const JWT_SECRET= "nogoodbad20";

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.redirect("/login");

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.redirect("/login");

        req.user = decoded;
        next();
    });
}
function isAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).send("Admins only 🚫");
    }
    next();
}

app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "api")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "checkout")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "اقسام المنتجات")));
app.use(express.static(path.join(__dirname, "منتجات")));
app.use(express.static(path.join(__dirname, "login&registry")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 8080;



// المسار الذي حددته أنت


// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // مجلد ملفات HTML/CSS/JS

const { log, error } = require("console");
const { register } = require("module");
const sql = require("mysql2");

const sqlconction = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // التعديل الضروري لـ Aiven
    ssl: {
        rejectUnauthorized: false
    },
    // إعدادات إضافية لضمان استقرار الاتصال
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// --- Paymob Config ---
const PAYMOB_API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRFeE1ETTFPQ3dpYm1GdFpTSTZJakUzTmpRME16azJOVEF1TVRRNE1qVTJJbjAuMjZCUXdKeVZ5VFZqMlJta2p0d2J4ZURWXzNzdFFyc2hDWm8yMG5LdEs4VlZ4c0FtanViNklLVUwwLTNFM1BKQXFuTG81anNBM0JrSy1zSmpieDROOFE=";          // من حساب Sandbox
const INTEGRATION_ID = "5412067";  // من Paymob
const IFRAME_ID = "982843";            // من Paymob

// --- Functions ---
async function getPaymobToken() {
    const response = await axios.post(
        "https://accept.paymob.com/api/auth/tokens",
        { api_key: PAYMOB_API_KEY }
    );
    return response.data.token;
}

async function createPaymobOrder(token, amount) {
    const response = await axios.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
            auth_token: token,
            delivery_needed: "false",
            amount_cents: amount * 100,
            currency: "EGP",
            items: []
        }
    );
    return response.data.id;
}

async function getPaymentKey(token, orderId, amount, customer = {}) {
    try {

        const response = await axios.post(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
                auth_token: token,
                amount_cents: amount, // ⚠️ هنا amount already *100
                expiration: 3600,
                order_id: orderId,

                billing_data: {
                    first_name: customer.firstName || "User",
                    last_name: customer.lastName || "Test",
                    email: customer.email || "test@test.com",
                    phone_number: customer.phone || "01000000000",
                    apartment: "NA",
                    floor: "NA",
                    street: customer.address || "NA",
                    building: "NA",
                    city: customer.country || "Cairo",
                    state: "NA",
                    country: "EG",
                    postal_code: "11511"
                },

                currency: "EGP",
                integration_id: INTEGRATION_ID
            }
        );

        return response.data.token;

    } catch (error) {
        console.error("❌ PAYMENT KEY ERROR:",
            error.response?.data || error.message
        );
        throw error;
    }
}


app.post("/pay", (req, res) => {
    const { firstName, lastName, email, phone, country, address, cart } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "السلة فارغة" });
    }

    sqlconction.getConnection((err, connection) => {
        if (err) {
            console.error("DB Connection Error:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }

        connection.beginTransaction((tErr) => {
            if (tErr) {
                connection.release();
                return res.status(500).json({ error: "Transaction failed" });
            }

            let completed = 0;
            let hasError = false;

            cart.forEach((item) => {

                if (!item.product_id || !item.qty || !item.price) {
                    hasError = true;
                    return connection.rollback(() => {
                        connection.release();
                        return res.status(400).json({ error: "Invalid cart data" });
                    });
                }

                connection.query(
                    "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
                    [item.qty, item.product_id, item.qty],
                    (uErr, uResult) => {

                        if (hasError) return;

                        if (uErr || uResult.affectedRows === 0) {
                            hasError = true;
                            return connection.rollback(() => {
                                connection.release();
                                return res.status(400).json({
                                    error: `Product ${item.name || item.product_id} not available`
                                });
                            });
                        }

                        completed++;

                        if (completed === cart.length) {

                            let total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

                            connection.query(
                                `INSERT INTO orders 
                                (amount, first_name, last_name, email, phone, country, address, pay_status)
                                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
                                [total, firstName, lastName, email, phone, country, address],
                                (oErr, oResult) => {

                                    if (oErr) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            return res.status(500).json({ error: "Order insert failed" });
                                        });
                                    }

                                    const orderId = oResult.insertId;

                                    const items = cart.map(i => [
                                        orderId,
                                        i.product_id,
                                        i.qty,
                                        i.price
                                    ]);

                                    connection.query(
                                        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
                                        [items],
                                        (iErr) => {

                                            if (iErr) {
                                                return connection.rollback(() => {
                                                    connection.release();
                                                    return res.status(500).json({ error: "Items insert failed" });
                                                });
                                            }

                                            connection.commit((cErr) => {

                                                if (cErr) {
                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        return res.status(500).json({ error: "Commit failed" });
                                                    });
                                                }

                                                // =========================
                                                // 💳 Paymob (async isolated)
                                                // =========================
                                                (async () => {
                                                    try {

                                                        const token = await getPaymobToken();
                                                        const amountCents = Math.round(total * 100);

                                                        const paymobId = await createPaymobOrder(token, amountCents);

                                                        connection.query(
                                                            "UPDATE orders SET paymob_order_id = ? WHERE id = ?",
                                                            [paymobId, orderId]
                                                        );

                                                        const paymentKey = await getPaymentKey(
                                                            token,
                                                            paymobId,
                                                            amountCents,
                                                            { firstName, lastName, email, phone, country, address }
                                                        );

                                                        connection.release();

                                                        return res.json({
                                                            success: true,
                                                            iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey}`,
                                                            orderId
                                                        });

                                                    } catch (pErr) {

                                                        console.error("🔥 Paymob Error:", pErr);

                                                        connection.query(
                                                            `UPDATE products p
                                                             JOIN order_items oi ON p.id = oi.product_id
                                                             SET p.stock = p.stock + oi.quantity
                                                             WHERE oi.order_id = ?`,
                                                            [orderId]
                                                        );

                                                        connection.query(
                                                            "UPDATE orders SET pay_status='failed' WHERE id = ?",
                                                            [orderId]
                                                        );

                                                        connection.release();

                                                        return res.status(500).json({
                                                            error: "Payment failed",
                                                            details: pErr.message
                                                        });
                                                    }
                                                })();
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            });
        });
    });
});
app.post("/webhook", (req, res) => {
    try {
        const transaction = req.body?.obj;
        if (!transaction) return res.sendStatus(400);

        const paymobOrderId = transaction?.order?.id;
        const isSuccess = transaction?.success === true || transaction?.txn_response_code === "APPROVED";

        if (!isSuccess) {
            console.log(`❌ Payment failed for Paymob Order: ${paymobOrderId}. Restocking...`);
            
            // 1. إعادة المخزون (Restock) للأوردر اللي كان Pending وفشل
            sqlconction.query(
                `UPDATE products p 
                 JOIN order_items oi ON p.id = oi.product_id 
                 JOIN orders o ON o.id = oi.order_id 
                 SET p.stock = p.stock + oi.quantity 
                 WHERE o.paymob_order_id = ? AND o.pay_status = 'pending'`,
                [paymobOrderId],
                (err, result) => {
                    if (err) console.error("Restock Error:", err);
                    
                    // 2. تحديث حالة الأوردر لـ Failed
                    sqlconction.query(
                        "UPDATE orders SET pay_status='failed' WHERE paymob_order_id=?", 
                        [paymobOrderId]
                    );
                }
            );
            return res.sendStatus(200);
        }

        // ✅ الدفع نجح: نغير الحالة لـ Paid فقط (المخزون مخصوم مسبقاً)
        sqlconction.query(
            "UPDATE orders SET pay_status='paid', transaction_id=? WHERE paymob_order_id=? AND pay_status='pending'",
            [transaction.id, paymobOrderId],
            (err, result) => {
                if (err) return res.sendStatus(500);
                
                if (result.affectedRows === 0) {
                    console.log("⚠️ Duplicate or already processed webhook.");
                } else {
                    console.log("✅ Order successfully marked as PAID");
                }
                res.sendStatus(200);
            }
        );

    } catch (err) {
        console.error("Webhook unexpected error:", err);
        res.sendStatus(500);
    }
});
function updateStock(paymobOrderId) {

    sqlconction.getConnection((err, conn) => {
        if (err) return console.error(err);

        conn.beginTransaction((err) => {
            if (err) return conn.release();

            conn.query(
                "SELECT id FROM orders WHERE paymob_order_id = ?",
                [paymobOrderId],
                (err, rows) => {

                    if (err || !rows.length) {
                        return conn.rollback(() => conn.release());
                    }

                    const orderId = rows[0].id;

                    conn.query(
                        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
                        [orderId],
                        (err, items) => {

                            if (err || !items.length) {
                                return conn.rollback(() => conn.release());
                            }

                            let done = 0;
                            let failed = false;

                            items.forEach(item => {

                                conn.query(
                                    `UPDATE products 
                                     SET stock = stock - ? 
                                     WHERE id = ? AND stock >= ?`,
                                    [item.quantity, item.product_id, item.quantity],
                                    (err, result) => {

                                        if (err || result.affectedRows === 0) {
                                            failed = true;
                                            return conn.rollback(() => conn.release());
                                        }

                                        done++;

                                        if (done === items.length && !failed) {

                                            conn.query(
                                                "UPDATE orders SET is_stock_updated = 1 WHERE id = ?",
                                                [orderId],
                                                (err) => {

                                                    if (err) {
                                                        return conn.rollback(() => conn.release());
                                                    }

                                                    conn.commit((err) => {
                                                        if (err) {
                                                            return conn.rollback(() => conn.release());
                                                        }

                                                        console.log("🎉 SAFE STOCK DONE");

                                                        conn.release();
                                                    });
                                                }
                                            );
                                        }
                                    }
                                );
                            });
                        }
                    );
                }
            );
        });
    });
}




// api لارسال معلومات المنتج لي الcard

app.get("/api/pods/info/products",(req,res)=>{
     sqlconction.query("select *from products",(err,result)=>{
        if(err){
            console.log("not done",err)
            return res.status(400).send("data base query error 400")
        }else{
            res.json(result)
        }
    })
})

// api لارسال معلومات المنتج لي الcard
app.get("/add/pod/proudct/on/page",(req,res)=>{
    const category ='pod'
    sqlconction.query("select * from products where category=?",[category],(err,result)=>{
        if(err){
            res.status(500).send(err,"fail")
        }else{
            res.json(result)
        }
    })
})
// api لارسال معلومات المنتج لي الcard
app.get("/add/mod/proudct/on/page",(req,res)=>{
    const category= 'mod'
    sqlconction.query("select * from products where category=?",[category],(err,result)=>{
        if(err){
            res.status(500).send(err,"fail")
        }else{
            res.json(result)
        }
    })
})
// api لارسال معلومات المنتج لي الcard
app.get("/add/liqued/proudct/on/page",(req,res)=>{
    const category ='liquid'
    sqlconction.query("select * from products where category=?",[category],(err,result)=>{
        if(err){
            res.status(500).send(err,"fail")
        }else{
            res.json(result)
        }
    })
})


app.get("/api/pods/info/products/:id", (req, res) => {
    let id = req.params.id;
    sqlconction.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log("DB query error:", err);
            return res.status(400).send("Database query error 400");
        } else {
            // فقط إرسال البيانات للـ client
            res.json(result);
        }
    });
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // الأفضل استخدام مسار نسبي أو التأكد من المسار المطلق بهذا الشكل:
    cb(null, path.join(__dirname, "public/img"));
  },
  // ... بقية الكود
});

const upload = multer({ storage: storage });


app.post("/addProudct/sendDb", upload.single("img"), (req, res) => {
  const { link, name, price, table } = req.body;

  const alowedTable = ["mods", "liquids", "products"];

  if (!alowedTable.includes(table)) {
    return res.status(400).send("لا يمكن التخزين في هذا الجدول");
  }

  let imagePath = null;

  if (req.file) {
    imagePath = req.file.filename;
  }

  const sqlQuery = `INSERT INTO ?? (link,name,price,image) VALUES (?,?,?,?)`;

  sqlconction.query(
    sqlQuery,
    [table, link, name, price, imagePath],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("fail to send");
      } else {
        res.send("success");
      }
    }
  );
});




// زارير صفحه الorder
// function deletedOrders(req,res){
//     const id =req.params.id;
//     const sqldelete = "DELETE FROM orders WHERE id=?"
//     sqlconction.query(sqldelete,[id],(err,result)=>{
//         if (err){
//            return res.status(500).send(err)
//         }else{
//             res.status(200).send("deleted")
//         }
//     })
// }
// app.delete("/deleted/orders/:id",deletedOrders)
// //اضافه الاوردت الخلصانه
// app.get("/insert/in/orders/done",(req,res)=>{
//    const sqlquery ="insert into orders_done (id,name,amount,email,phone,status) values(?,?,?,?,?,?)"
//    sqlconction.query(sqlquery,)
// })
// app.use(express.json()); // ❗ مهم جدًا
app.post("/orders/done/:id", (req, res) => {

    const orderId = req.params.id;

    // 1. هات الطلب من orders
    sqlconction.query(
        "SELECT * FROM orders WHERE id = ?",
        [orderId],
        (err, rows) => {

            if (err || !rows.length) {
                return res.status(404).json({ error: "Order not found" });
            }

            const order = rows[0];

            // 2. نقل البيانات لـ orders_done (حسب جدولك)
            sqlconction.query(
                `INSERT INTO orders_done (id, name, amount, email, phone, pay_status,status)
                 VALUES (?, ?, ?, ?, ?, ?,?)`,
                [
                    order.id,
                    `${order.first_name} ${order.last_name}`, // دمج الاسم
                    order.amount,
                    order.email,
                    order.phone,
                    order.pay_status,
                    order.status
                ],
                (err2) => {

                    if (err2) {
                        console.error("INSERT ERROR:", err2);
                        return res.status(500).json({ error: "Insert failed" });
                    }

                    // 3. حذف من orders
                    sqlconction.query(
                        "DELETE FROM orders WHERE id = ?",
                        [orderId],
                        (err3) => {

                            if (err3) {
                                console.error("DELETE ERROR:", err3);
                                return res.status(500).json({ error: "Delete failed" });
                            }

                            return res.json({ success: true });
                        }
                    );
                }
            );
        }
    );
});

app.get("/insert/done/orders/on/orderdone.html",(req,res)=>{
    const sqlquery="select * from orders_done"
    sqlconction.query(sqlquery,(err,result)=>{
        if(err){
            return res.status(500).send(console.log({err:"فشل في جلب البيانات من orders_done"}))
        }else{
            res.json(result)
        }
    })
})
function updateOrders(req,res){
 const { id, status } = req.body;

    const sql = "UPDATE orders SET status = ? WHERE id = ?";

    sqlconction.query(sql, [status, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false });
        }

        res.json({ success: true });
    });
}
app.post("/orders/status/update", updateOrders)
   



// ------------------------------End-----------------------------------------------
// صفحه home
app.get("/home",(req,res)=>{
    res.render('index')
})
app.get('/', (req, res) => {
    res.redirect('/home');
});
// صفحه checkout
app.get("/checkout", (req, res) => {
    res.render('checkout')
});

// link صفحه منتجات ال pods
app.get("/category/pods", (req, res) => {

  sqlconction.query("SELECT * FROM products", (err, products) => {
    if (err) return res.status(500).send(err);

    const brands = [...new Set(products.map(p => p.brand))];

    res.render("pods", {
      products,
      brands
    });
  });

});

// link صفحه منتجات ال mods
app.get("/category/mods",(req,res)=>{

sqlconction.query("SELECT * FROM products", (err, products) => {
    if (err) return res.status(500).send(err);

    const brands = [...new Set(products.map(p => p.brand))];

    res.render("mods", {
      products,
      brands
    });
  });
})

// link صفحه منتجات ال liqued
app.get("/category/liqued",(req,res)=>{
sqlconction.query("SELECT * FROM products", (err, products) => {
    if (err) return res.status(500).send(err);

    const brands = [...new Set(products.map(p => p.brand))];

    res.render("Elequid", {
      products,
      brands
    });
  });
})
  app.get('/products/random', (req, res) => {
    sqlconction.query("SELECT * FROM products ORDER BY RAND() LIMIT 12", (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(result);
        }
    });
});

// link صفحه admin dashbord
app.get(
    "/admin/dashbord/add-product",
    verifyToken,
    isAdmin,
    (req, res) => {
        res.sendFile(path.join(__dirname, "/views/admin.html"));
    }
);

app.get("/admin/dashbord/orders-items",verifyToken,isAdmin,(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"/views/orderItems.html"))
})

app.get("/admin/dashbord/order",verifyToken,isAdmin,(req,res)=>{
    res.sendFile(path.join(__dirname, "/views/order.html"))
})

app.get("/admin/dashbord/order_done",verifyToken,isAdmin,(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/orderdone.html"))
})
app.get("/admin/dashbord/restock",verifyToken,isAdmin,(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/restock.html"))
})

app.get("/show/orders/on/site",(req,res)=>{
    const sqlquery ="select * from orders"
    sqlconction.query(sqlquery,(err,result)=>{
        if(err){
            res.status(404).send("faild")
        }else{
            res.json(result)
        }
    })
})
// restock page
app.get("/restock/product",(req,res)=>{
    const sql ="select * from products"
    sqlconction.query(sql,(err,result)=>{
        if(err){
            return res.send(console.log({err:err}))
            
        }else{
            res.json(result)
        }
    })
})
///////////////////////////
app.put("/update/stock",(req,res)=>{
    const {id,stock} =req.body
    const sql="update products set stock=? where id=?"
    sqlconction.query(sql,[stock,id],(err,result)=>{
        if(err){
            return res.send(console.log({err:err})
            )
        }else{
            res.json(result)
        }
    })
})

app.post("/insert/proudct",upload.single("img"),(req,res)=>{
    const {id,name,price,link,brand,brandLink,stock,category,description} =req.body
     let imagePath = null;

  if (req.file) {
    imagePath = req.file.filename;
  }
    const sql ="insert into products(id,name,price,image,link,brand,brandLink,stock,category,description) values (?,?,?,?,?,?,?,?,?,?)"
    sqlconction.query(sql,[id,name,price,imagePath,link,brand,brandLink,stock,category,description],(err,result)=>{
        if(err){
            return res.send(console.log({err:err})
            )
        }else{
            res.json(result)
        }

    })
})


app.delete("/deleteing/proudcts",(req,res)=>{
    const id =req.body.id
    let sql ="DELETE FROM `store`.`products` WHERE id = ?"
    sqlconction.query(sql,[id],(err,result)=>{
        if(err){
         console.log(err);
return res.json({ success: false });
        }else{
            res.json(result);
        }
    })
})
// end

// app.get("/api/orders_items",(req,res)=>{
//     let sqlQ="select*from order_items"
//     sqlconction.query(sqlQ,(err,result)=>{
//         if(err){
//            return res.status(500).json({error:"Database query failed"})
//         }else{
//             res.json(result)
//         }
//     })
// })

app.get("/api/orders_items", (req, res) => {
    let sqlQ = `
        SELECT 
            oi.id,
            oi.order_id,
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.price
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
    `;

    sqlconction.query(sqlQ, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.json(result);
    });
});








// log in and register
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/login.html"))
})
app.get("/registry",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/registry.html"))
})

app.post("/api/registry", async (req, res) => {
    const { firstName, lastName, email, password} = req.body;

    const sqlCheck = "SELECT * FROM users WHERE email = ?";

    sqlconction.query(sqlCheck, [email], async (err, result) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        // 🚫 لو الإيميل موجود
        if (result.length > 0) {
            return res.status(409).send("Email already exists");
        }

        // 🔐 hash password بعد ما نتأكد
        const hashpassword = await bcrypt.hash(password, 10);

        const sqlInsert =
            "INSERT INTO users (first_name, last_name, email, password,role) VALUES (?, ?, ?, ?,?)";

        sqlconction.query(
            sqlInsert,
            [firstName, lastName, email, hashpassword,"user"],
            (err, result) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }

                res.redirect("/login");
            }
        );
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    sqlconction.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).send(err.message);

        if (result.length === 0) {
            return res.status(401).send("Invalid credentials");
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }
        
      const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
);

        // 🔥 هنا الفرق
        res.cookie("token", token, {
            httpOnly: true,   // مهم جدًا للأمان
            secure: false,    // خليها true في production (HTTPS)
            maxAge: 3600000   // 1 hour
        });

       res.json({ message: "success" });
    });
});


// filters orders_items page
app.get("/orders-items", (req, res) => {
    const { order_id } = req.query;

    const sqlQ = `
        SELECT 
            oi.id,
            oi.order_id,
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.price
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?
    `;

    sqlconction.query(sqlQ, [order_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }

        res.json(result);
    });
});


// __________________________________________________________________________
// صفحه المنتجات 
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});
app.get("/product/:name", (req, res) => {

    sqlconction.query(
        "SELECT * FROM products WHERE name = ?",
        [req.params.name],
        (err, result) => {

            if (err) {
                return res.render("product", {
                    product: null,
                    error: "Database error"
                });
            }

            if (!result || result.length === 0) {
                return res.render("product", {
                    product: null,
                    error: "Product not found"
                });
            }

            res.render("product", {
                product: result[0],
                error: null
            });
        }
    );

});


// restore orders fail on stock
cron.schedule('*/2 * * * *', () => {
    console.log("🧹 Running Auto-Restock Task...");

    const findExpiredOrders = `
        SELECT id FROM orders 
        WHERE pay_status = 'pending' 
        AND created_at < (NOW() - INTERVAL 2 MINUTE)`;

    sqlconction.query(findExpiredOrders, (err, orders) => {
        if (err) {
            console.error("❌ Cron Job Error:", err);
            return;
        }

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                // 1. إرجاع المخزون
                const restockSql = `
                    UPDATE products p 
                    JOIN order_items oi ON p.id = oi.product_id 
                    SET p.stock = p.stock + oi.quantity 
                    WHERE oi.order_id = ?`;

                sqlconction.query(restockSql, [order.id], (reErr) => {
                    if (reErr) {
                        console.error(`❌ Failed to restock order ${order.id}:`, reErr);
                    } else {
                        // 2. تحديث الحالة لـ expired عشان ميتكررش
                        sqlconction.query(
                            "UPDATE orders SET pay_status = 'expired' WHERE id = ?", 
                            [order.id],
                            () => console.log(`♻️ Order ${order.id} expired & items restocked.`)
                        );
                    }
                });
            });
        }
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`connect on port ${port}`);
});
