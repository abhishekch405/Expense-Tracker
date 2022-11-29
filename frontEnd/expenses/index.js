window.addEventListener("DOMContentLoaded",showExpenses);
async function showExpenses(){
    const url="http://localhost:3000/expense/get"
    try {
        const expenses= await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
        console.log(typeof expenses.data);
        expenses.data.forEach(item=>{
            addNewLineElement(item);
        })
    } catch (error) {
        console.log(error);
    }
}

const form=document.getElementById('form');

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
