async function pay(cart) {

    if (!cart || cart.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart is empty',
            text: 'Add products first'
        });
        return;
    }

    try {

        Swal.fire({
            title: 'Processing...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch("/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cart })
        });

        const data = await res.json();

        Swal.close();

        // ❌ error from server
        if (!data.success) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || "Payment failed"
            });
            return;
        }

        // ✅ success
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Redirecting to payment...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = data.iframeUrl;
        });

    } catch (err) {

        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Try again later'
        });

        console.error(err);
    }
}