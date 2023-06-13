const app = Vue.createApp({
    data() {
      return {
       theTime: 0,
      }
    },
    components: {

        'time-display': 
        {
            template: 
            /*html*/ 
            `<h1 id="theclock">The time is {{theTime}}</h1>`,
        

            data() {
                return {
                        theTime : 'Vue is active'
                    }
            },
            //------- Code to run when the Page loads
            mounted() {
                setInterval(() => {
                    this.theTime = new Date().toLocaleString();
                }, 1000)
            },





        }


    }
  });
  
  app.mount("#capp");



  
