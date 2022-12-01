
const loginbtn=document.getElementById('loginbutton');

loginbtn.addEventListener('click',login);

async function login(e){
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
            if(email.length>0 && password.length>0){
            const object={
                email:email,
                password:password
            }
            email.value="";
            password.value="";
            let res;
            const url='http://localhost:3000/user/login';
            try {
                res=await axios.post(url,object);
                console.log("response of post ",res.data);
                localStorage.setItem('token',res.data.token);

                const notif=document.getElementById('notif');

                notif.classList.add("active");
                notif.innerHTML=`<h2>${res.data.message}</h2>`
                setTimeout(()=>{
                    notif.classList.remove("active"); 
                    console.log("Notif removed");
                    window.location.href='../mainFrontEnd/index.html';
                },3000)
            } catch (err) {
                alert(err.response.data.message);
            }
         }
         else{
                alert("Please fill all the fields");
            }

}


