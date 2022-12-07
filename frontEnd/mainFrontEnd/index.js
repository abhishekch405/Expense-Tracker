// window.addEventListener("DOMContentLoaded",showExpenses);
// async function showExpenses(){
//     const url="http://localhost:3000/expense/get"
//     try {
//         const expenses= await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
//         console.log(typeof expenses.data);
//         expenses.data.forEach(item=>{
//             addNewLineElement(item);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

const form=document.getElementById('form');
const allexpenseBtn=document.getElementById('getallexpenses');
const dailyBtn=document.getElementById("daily");
const monthlyBtn=document.getElementById("monthly");
const weeklyBtn=document.getElementById("weekly");
let limit;
allexpenseBtn.addEventListener('click',()=>{
    limit='all';
    displayExpenses(limit);
})

dailyBtn.addEventListener('click',(e)=>{
    limit='daily';
    displayExpenses(limit);
});
monthlyBtn.addEventListener('click',()=>{
    limit='monthly';
    displayExpenses(limit);
});
weeklyBtn.addEventListener('click',()=>{
    limit='weekly';
    displayExpenses(limit);
});


async function displayExpenses(limit,page=1,rows=localStorage.getItem('rows')){
  
    const carth2tag=document.querySelector('#cart h2');
    carth2tag.innerHTML=`<h2>EXPENSES</h2>`

    const url=`http://localhost:3000/expense/get?limit=${limit}&page=${page}&rows=${rows}`
try {
    const response=await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
    const cart=document.getElementById('cart-items');
    cart.innerHTML="";
    response.data.expenses.forEach(expense=>{
        addNewLineElement(expense);
    })
    pagination(response)
} 
catch (error) {
    console.log(error);
}

}




form.addEventListener('submit',addExpenses);

function addExpenses(e){
    e.preventDefault();
    const amount=document.getElementById('amount');
    const description=document.getElementById('description');
    const category=document.getElementById('category');
    url='http://localhost:3000/expense/add';

    
    const obj={
        amount:amount.value,
        description:description.value,
        category:category.value
    }
    amount.value="";
    description.value="";
    category.value="";
    //console.log(obj);
       
    axios.post(url,obj,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
        .then((res)=>{
            obj.id=res.data.id;
            console.log(obj);
            addNewLineElement(obj);
            console.log('Request Sent',res.data)
        })
        .catch(err=>console.log(err))

}

function addNewLineElement(object){
    console.log('adding new element');
    const cart=document.getElementById('cart-items');
    const cartItem=document.createElement('div');
   // cartItem.setAttribute("id",`${productId}`);
    cartItem.classList.add('cart-row');
    
    cartItem.innerHTML=`<span class="cart-item cart-column">
    <span>${object.amount}</span></span>
    <span class="cart-price cart-column">${object.description}</span>
    <span class="cart-quantity cart-column"> ${object.category} <button id=${object.id} class="del">REMOVE</button></span>`;
    cart.appendChild(cartItem);
}

const del=document.getElementById("cart-items");
del.addEventListener('click',(e)=>{
    if(e.target.className=="del"){
        console.log(e.target.id);
        const url="http://localhost:3000/expense/delete";
        const obj={
            id:e.target.id
        }
        axios.post(url,obj,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
            .then(res=>{
                e.target.parentNode.parentNode.remove();
                console.log(res.data.message);
            })
            .catch(err=>console.log(err))
    }
})

const premium=document.getElementById('premium');
const close=document.getElementById('close');
const payBtn=document.getElementById('pay');
const container=document.getElementById('container');
let amount=499;
let orderId;


premium.addEventListener('click',()=>{
        container.classList.add("active");
        const url="http://localhost:3000/premium/order";
        const obj={amount:amount};
    
    axios.post(url,obj,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
        .then(response=>{
            console.log(response);
            orderId=response.data.order.id;
            payBtn.style="display:block";
        })
        .catch(err=>console.log(err));
})
close.addEventListener('click',()=>{
        container.classList.remove("active");
});


let paymentId;
let signature;
payBtn.addEventListener('click',(e)=>{
    container.classList.remove("active");
    payBtn.style="display:none"
    var options = {
        "key": "rzp_test_vQI2AlV3SQaMgo", // Enter the Key ID generated from the Dashboard
        "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Premium",
        //"image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            paymentId=response.razorpay_payment_id;
            signature=response.razorpay_signature;
           alert(`Payment successful: your order ID: ${response.razorpay_order_id} and payment ID:${response.razorpay_payment_id}`);
            window.location.href="../premiumFrontEnd/premium.html"

            console.log("oishoiajiaj",orderId);

            axios.post('http://localhost:3000/transaction/detail',{orderId:orderId,paymentId:paymentId},{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
            .then()
            .catch(err=>{
                console.log(err)
            })
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();

})



function pagination(response){
    const container=document.getElementById('pagination')
    const rows=parseInt(localStorage.getItem('rows'));
    container.innerHTML=`
    <form> 
    <label for="rows">Rows Per Page:</label>
    <select name="rowsPerPage" id="rows" style="width:60px;padding:0px" value="50">
          <option disabled selected value> ${localStorage.getItem('rows')}</option>
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=25>25</option>
          <option value=50>50</option>
   </select>
   <button type="click" id="rowsPerPage">Submit</button>
   </form>
   <br>
    <span>
         <button id="firstPage" onclick="displayExpenses(${limit},${1},${rows})">1</button>
         <button id="previousPage" onclick="displayExpenses(${limit},${response.data.previousPage},${rows})">${response.data.previousPage}</button>
         <button id="currentPage" onclick="displayExpenses(${limit},${response.data.currentPage},${rows})" class="active">${response.data.currentPage}</button>
         <button id="nextPage" onclick="displayExpenses(${limit},${response.data.nextPage},${rows})">${response.data.nextPage}</button>
         <button id="lastPage" onclick="displayExpenses(${limit},${response.data.lastPage},${rows})">${response.data.lastPage}</button>
    </span>
    `
    const firstPage=document.getElementById(`firstPage`);
    const currentPage=document.getElementById(`currentPage`);
    const previousPage=document.getElementById(`previousPage`);
    const nextPage=document.getElementById(`nextPage`);
    const lastPage=document.getElementById(`lastPage`);
    if(parseInt(currentPage.innerText)==1)
    firstPage.style.display='none'
    if(parseInt(previousPage.innerText)<1 || parseInt(previousPage.innerText)==firstPage.innerText)
    previousPage.style.display='none'
    if(parseInt(nextPage.innerText)>parseInt(lastPage.innerText))
    nextPage.style.display='none'
    if(parseInt(currentPage.innerText)==parseInt(lastPage.innerText) || parseInt(nextPage.innerText)==parseInt(lastPage.innerText) )
    lastPage.style.display='none'

    //when rows per page clicked
    //dynamic pagination
    const rowsPerPageBtn=document.getElementById('rowsPerPage')
    rowsPerPageBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    localStorage.setItem('rows',document.getElementById('rows').value)
    displayExpenses()

})

}
