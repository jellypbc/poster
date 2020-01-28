// import consumer from "./consumer"

// // TODO: move this into a react provider
// document.addEventListener("DOMContentLoaded", function(event) {

//   var post = document.getElementById('post').getAttribute("data-post-id")
//   console.log(post)

//   consumer.subscriptions.create({channel: "PostsChannel", post_id: post}, {
//     connected() {
//     	console.log("connected to PostsChannel")
//     },

//     disconnected() {
//       // Called when the subscription has been terminated by the server
//     },

//     received(data) {
//       location.reload();
//     }
//   });
// });

