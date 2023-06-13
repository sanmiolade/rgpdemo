//Create the Vue Optional Object parameter 
const vueOptObject = {
    //-----------------the data object-------------------
    data() {
        return {
                activeMsg : 'Vue is active',
                userpwd: '',
                useremail: ''
        }
    },

    //------- Code to run when the Page loads
    mounted() {
        setInterval(() => {
            this.activeMsg = new Date().toLocaleTimeString();
        }, 1000)
    },

    // Methods of this App
    methods: {
        doLoginSubmit() {
            console.log('Submit button clicked');
           
            if(this.useremail === '') {
                alert('Please enter your user email');
                this.$refs.useremail.focus();
                return false;
            }

            if(this.userpwd === '') {             
               
                alert('Please enter your user password');
                this.$refs.userpwd.focus();
                return false;
            }            
// perform the authentication logic here 
            location.href='home.html'
            return
        }
    }


}

const theapp = Vue.createApp(vueOptObject).mount('#loginApp')