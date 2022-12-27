
//swindow.addEventListener("DOMContentLoaded",previousDownloads);
const showDownloads=document.getElementById("showPreviousDownloads");
showDownloads.addEventListener('click',previousDownloads);
async function previousDownloads(){
    const previosDownloadDiv=document.getElementById('previousDownloads');
    previosDownloadDiv.style.border='1px solid green';
   
    const url="http://13.232.112.39:3000/previousdownloads"
    let response;
    try {
        response= await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
    } catch (error) {
        console.log(error);
    }
    const links=response.data.links
    previosDownloadDiv.innerHTML='';
    let heading=document.createElement('h2');
    heading.innerHTML="Previous Downloads";
    previosDownloadDiv.append(heading);
    const ul=document.createElement('ul');
    links.reverse().forEach(link=>{
        const li=document.createElement('li');
        li.innerHTML=`<a href=${link.link}>${link.fileName}</a>`
        ul.appendChild(li);
    });
    previosDownloadDiv.appendChild(ul);
    
    const closeDownload=`<button type="click" id="closeDownloadBtn">Close</button>`;
    previosDownloadDiv.innerHTML+=closeDownload;
    document.getElementById('closeDownloadBtn').addEventListener('click',(e)=>{
        previosDownloadDiv.innerHTML='';
        previosDownloadDiv.style.border="none";    
    })


}

const toggle=document.getElementById("toggle");

toggle.addEventListener("change",(e)=>{
    document.body.classList.toggle("dark",e.target.unchecked);
});


const form=document.getElementById('form');

form.addEventListener('submit',addExpenses);
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

const downloadBtn=document.getElementById('download');
downloadBtn.addEventListener('click',async ()=>{
    const url="http://13.232.112.39:3000/download"
    try {
        const response=await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
        const link=document.createElement('a');
        link.href=`${response.data.fileUrl}`;
        console.log(response.data);
        link.type='application/pdf'
        link.download='Myexpenses.csv';
        link.click();     
    } catch (error) {
        document.innerHTML+=`<div>${error}</div>`;
    }
   
})

async function displayExpenses(limit,page=1,rows=localStorage.getItem('rows')){
  
    const carth2tag=document.querySelector('#cart h2');
    carth2tag.innerHTML=`<h2>EXPENSES</h2>`

    const url=`http://13.232.112.39:3000/expense/get?limit=${limit}&page=${page}&rows=${rows}`
try {
    const response=await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
    //new
    const cartheader=document.getElementsByClassName('cart-header')[0];
    cartheader.innerHTML='';
    cartheader.innerHTML=`<span class="cart-item cart-column">Amount</span>
                          <span class="cart-price cart-column">Description</span>
                          <span class="cart-quantity cart-column">Category</span>`;
    //end
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




function addExpenses(e){
    e.preventDefault();
    const amount=document.getElementById('amount');
    const description=document.getElementById('description');
    const category=document.getElementById('category');
    url='http://13.232.112.39:3000/expense/add';

    
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
        const url="http://13.232.112.39:3000/expense/delete";
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

const leaderBoardBtn=document.getElementById('showLeaderBoard');

leaderBoardBtn.addEventListener('click',async (e)=>{
    const url="http://13.232.112.39:3000/leaderboard";
    const response= await axios.get(url,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}});
    
    const data= response.data.leaderBoard;
    console.log(data)
    const leaderBoard=document.getElementById('leaderBoard');
    
    leaderBoard.innerHTML='';
    leaderBoard.style.border='1px solid black'
    const innerDiv=document.createElement('div');
    const h2=document.createTextNode('Leader Board')
    innerDiv.appendChild(h2);
    const ul=document.createElement('ul');
    data.forEach(o=>{
        const li=document.createElement('li');
        li.innerHTML=`${o.name}-${o.total_expense}`;
        ul.appendChild(li);
    })
    innerDiv.appendChild(ul);
    leaderBoard.appendChild(innerDiv);

    const closeleaderBoard=`<button type="click" id="closeLeaderBoardBtn">x</button>`;
    leaderBoard.innerHTML+=closeleaderBoard;

    
    document.getElementById('closeLeaderBoardBtn').addEventListener('click',(e)=>{
        leaderBoard.innerHTML='';
    })
})
