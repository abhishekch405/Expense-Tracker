
const loginbtn=document.getElementById('loginbutton');

loginbtn.addEventListener('click',login);

async function login(e){
        e.preventDefault();
        const email=document.getElementById('email');
        const password=document.getElementById('password');
            if(email.value.length>0 && password.value.length>0){
            const object={
                email:email.value,
                password:password.value
            }
            email.value="";
            password.value="";
            let res;
            const url='http://localhost:3000/user/login';
            try {
                res=await axios.post(url,object);
                console.log("response of post ",res.data);
                const hasPremium=res.data.hasPremium;
                localStorage.setItem('token',res.data.token);

                const notif=document.getElementById('notif');

                notif.classList.add("active");
                notif.innerHTML=`<h2>${res.data.message}</h2>`
                setTimeout(()=>{
                    notif.classList.remove("active"); 
                    console.log("Notif removed");
                    if(hasPremium==='0'){
                    window.location.href='../mainFrontEnd/index.html';
                    }
                    else{
                        window.location.href="../premiumFrontEnd/premium.html";
                    }
                },0)
            } catch (err) {
                alert(err.response.data.message);
            }
         }
         else{
                alert("Please fill all the fields");
            }

}


const forgotPassword=document.getElementById('forgotpassword');

forgotPassword.addEventListener('click',(e)=>{
    
    console.log(document.body);
    const div=document.createElement('div');
    div.innerHTML=`<form method="post">
    <label for="email">Email</label>
    <input type="text" name="" id="resetemail" required>
    <div >
        <button type="submit" id="resetbutton">Submit</button>    
    </div>
    </form>`
    document.body.appendChild(div);
    resetbutton.addEventListener('click',(e)=>{
        const url="http://localhost:3000/password/forgotpassword";
        const email=document.getElementById('resetemail');

        const obj={
            email:email
        }
        axios.post(url,obj)
            .then(response=>{
                if(!response.data.success){
                    alert(response.data.message);
                    window.location.href='./signup.html'
                }
                else{
                    window.location.href="";
                }
            })
            .catch(err=>console.log(err));
    })
})

