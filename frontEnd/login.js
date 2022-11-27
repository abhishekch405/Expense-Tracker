
const loginbtn=document.getElementById('loginbutton');

loginbtn.addEventListener('click',login);

async function login(e){
        e.preventDefault();
        console.log(e);
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
            if(email.length>0 && password.length>0){
            const object={
                email:email,
                password:password
            }
            let res;
            const url='http://localhost:3000/user/login';
            try {
                res=await axios.post(url,object);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }

            const notif=document.getElementById('notif');
            //console.log(notif)
            notif.classList.add("active");
            notif.innerHTML=`<h2>${res.data.message}</h2>`

            //console.log(notif);
            setTimeout(()=>{notif.classList.remove("active"); console.log("done")},3000)

            // }else{
            //     alert("Please fill all the fields");
            // }
         }
}


