import "./styles/app.css";

export default function AppBottom(){
return(
    <div className='app-bottom'>

          <span disabled>© 2023 AVCC</span>

          <button onClick={ () => { alert( 'Calculation of the volume and weight of cargo on elevators.' ) }}>
            About</button>

          <button onClick={ () => {
            let email = document.createElement("a");
            email.href = "mailto:alvi.ua@gmail.com";
            email.click()} }
            title='alvi.ua@gmail.com'>
            FeedBack</button>

          <button onClick={ () => { alert( 'MIT License. Copyright (c) 2023 Aleksandr Vavilov (alvi.ua@gmail.com)' ) }} >
            Legal Notices</button>

    </div>
    )
}