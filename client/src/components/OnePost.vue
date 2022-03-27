<template>

     <v-main>


    <v-container fluid fill-height>
      <v-flex xs12 sm6 offset-sm3>
       
      <v-row class="mt-3 mx-2">
      <v-btn color="success" small to="/"> Retour </v-btn> <v-spacer></v-spacer>
      </v-row>

            <v-card class="spacing"  >
            <div v-if="post.imageUrl">
             <v-img
                :src="post.imageUrl.replace('/vid-api', '')"
                aspect-ratio="2.75"
              ></v-img>
            </div>
              <v-card-title secondary-title>
                <div>
                  <h3> Auteur: {{post.User.username}} </h3>
                  <h3 class="headline mb-0"> Titre: {{post.title}}</h3>
                   <p>Description: {{post.content}} </p>
                </div>
              </v-card-title>
              <v-card-actions>
            <v-spacer></v-spacer>   
            <v-btn
                color="red"
                class="white--text"
                v-show="userId == post.UserId || isAdmin == 'true'"
                @click="deletePost(post.id)"
                right
                rounded
                small
                > <v-icon>  mdi-delete </v-icon></v-btn>
              </v-card-actions>

                <v-card-actions class="my-8 px-4">
                 <v-textarea  :rules="[(v) => !!v || 'Required']" v-model="comment" auto-grow placeholder="Ecrivez vos commentaires" rows="1"> </v-textarea> <v-spacer></v-spacer> <v-btn @click="addCom(post.id)" small right>Commentez !</v-btn>
                </v-card-actions>
                 
               
               <v-card v-for="(comment) in comments.filter((comment) => {return comment.PostId == post.id})" :key="comment.id">
              <v-card-title>
            {{comment.User.username}}:  {{comment.content}} 
           <v-spacer></v-spacer>
            
            <v-btn
                color="red"
                class="white--text"
                @click="deleteComment(comment.id)"
                v-show="userId == comment.UserId || isAdmin == 'true'"
                depressed
                right
                rounded
                small
                > <v-icon>  mdi-delete </v-icon></v-btn>
              </v-card-title>
               
               </v-card>
            </v-card>
            

      
            
          </v-flex>
        </v-container>

      </v-main>
    
</template>

<script>
import axios from 'axios';
export default {
data() {
    return {
     post: {},
     userId: "",
     token: "",
     isAdmin: false,
     comments: [],
     inputRules: [
        v => !!v || 'Ce champ ne peut pas être vide',
        v => v.length >= 3 || 'Pas assez long'
      ]
    }
},

created() {
    this.userId = localStorage.getItem("userId");
    this.token = localStorage.getItem("token");
    this.isAdmin = localStorage.getItem("isAdmin");
    this.fetchComments();
     axios.get(`http://localhost:3000/api/post/${this.$route.params.id}`,
       { headers: {
          Authorization : `Bearer ${this.token}`,
         
        }})
     .then((res) => {
       let post = res.data;
 
         console.log(post);

         return this.post = res.data
       });
},

methods: {
     async addCom(id) {
     const token = this.token
     await axios.post(`http://localhost:3000/api/comment/${id}`, 
        {PostId : id, content: this.comment},
       { headers: {
           Authorization: `Bearer ${token}`,
        } 
      }).then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
        .catch(error => console.log(error)) ;
    },

    async fetchComments() {
    const token = await this.token;
    await axios.get(`http://localhost:3000/api/comment/`,
     { headers: {
          Authorization : `Bearer ${token}`,
        } 
      })
     .then((res) => {
        return this.comments = res.data
       });
    },
     async deletePost(id) {
    const token = this.token;
    if(confirm("Vous allez supprimez cette publication")) {
      await axios.delete(`http://localhost:3000/api/post/delete/${id}`,
         { headers: {
           Authorization: `Bearer ${token}`,
        }}) 
       .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
       .catch(error => console.log(error))
           }
    },

  async deleteComment(id) {
    const token = this.token;
        if(confirm("Vous allez supprimez ce commentaire")) {  
        await axios.delete(`http://localhost:3000/api/comment/delete/${id}`,
      { headers: {
        Authorization: `Bearer ${token}`,
        }
        })
       .then((response) =>  response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
       .catch(error => console.log(error))
        }
    }
  },

    async fetchPost(id) {       
    const token = this.token;   
    await axios.get(`http://localhost:3000/api/post/${id}`,
       { headers: {
          Authorization : `Bearer ${token}`,
         
        }})
     .then((res) => {
       let post = res.data;
 
         console.log(post);

         return this.post = res.data
       });
    },
}


</script>

<style scoped>

</style>