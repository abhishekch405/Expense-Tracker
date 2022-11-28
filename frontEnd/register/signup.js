
const form=document.getElementById('form-signup');

form.addEventListener('click',signup);

async function signup(e){
        e.preventDefault();
        if(e.target.className=="signup"){
            const name=document.getElementById('name').value;
            const email=document.getElementById('email').value;
            const password=document.getElementById('password').value;
            if(name.length>0 && email.length>0 && password.length>0){
            const newuser={
                name:name,
                email:email,
                password:password
            }
           let res;
            const url='http://localhost:3000/user/signup';
            try {
                res=await axios.post(url,newuser);
                console.log(res);
                name="";
                password='';
                email="";
            } catch (error) {
                console.log(error);
            }

            const notif=document.getElementById('notif');
            console.log(notif)
            notif.classList.add("active");
            notif.innerHTML=`<h2>${res.data.message}</h2>`

            console.log(notif);
            setTimeout(()=>{notif.classList.remove("active"); console.log("done")},3000)

            }else{
                alert("Please fill all the fields");
            }
        }
}


