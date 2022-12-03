
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


