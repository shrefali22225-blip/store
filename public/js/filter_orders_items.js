fetch("/orders-items?order_id=5")
  .then(res => res.json())
  .then(data => {
      console.log(data);
  });
  function getOrder() {
    let orderId = document.getElementById("orderId").value;

    fetch(`/orders-items?order_id=${orderId}`)
        .then(res => res.json())
        .then(result => {
            let card = document.querySelector(".card");

            let html = "";
            let total=0

            result.forEach(data => {
                html += `
                    <tr>
                          <td>${data.id}</td>
                           <td>${data.product_name}</td>
                           <td>${data.order_id}</td>
                           <td>${data.product_id}</td>
                           <td>${data.quantity}</td>
                           <td>${data.price}</td>
                    </tr>
                `;
                total+=data.quantity*data.price
            });

            card.innerHTML = html;
            let total_price_text =document.querySelector(".totalOrderPrice")
            total_price_text.textContent=total;
        })
        .catch(err => console.log(err));
}