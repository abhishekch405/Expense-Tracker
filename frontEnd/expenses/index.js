// window.addEventListener("DOMContentLoaded",showonscreen);

// function showonscreen(){
//     axios.get('http://localhost:4000')
//         .then(expenses=>{
//             //console.log(expenses.data)
//             for(let i=0;i<expenses.data.length;i++){
//                 addNewLineElement(expenses.data[i]);
//             }
//         })
//         .catch(err=>console.log(err))
//     ;    
// }

const form=document.getElementById('form');

form.addEventListener('submit',sendData);

function sendData(e){
    e.preventDefault();
    const amount=document.getElementById('amount').value;
    const description=document.getElementById('description').value;
    const category=document.getElementById('category').value;
    url='http://localhost:3000/expense/add';

    if(amount && description && category){
        const obj={
            amount:amount,
            description:description,
            category:category
        }
        console.log(obj);
        //console.log('req ',obj);
        axios.post(url,obj).then((res)=>{
            addNewLineElement(obj);
        console.log('Request Sent',res.data)}).catch(err=>console.log(err))
    }

}

function addNewLineElement(object){
    console.log('adding new element');
    // var items = document.getElementById('items');
    // var li=document.createElement('li');
    // li.className='list-item';
    // li.appendChild(document.createTextNode(object.amount+' '+ object.description+" "+object.category));
    // items.append(li);
    const cart=document.getElementById('cart-items');
    const cartItem=document.createElement('div');
   // cartItem.setAttribute("id",`${productId}`);
    cartItem.classList.add('cart-row');
    
    cartItem.innerHTML=`<span class="cart-item cart-column">
    <span>${object.amount}</span></span>
    <span class="cart-price cart-column">${object.description}</span>
    <span class="cart-quantity cart-column"> ${object.category} <button id="del" class="del">REMOVE</button></span>`;
    cart.appendChild(cartItem);
}