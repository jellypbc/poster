import consumer from "./consumer"

consumer.subscriptions.create("PostsChannel", {
  connected() {
  	console.log("connected to PostsChannel")
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log("<<<<< receiving")
    console.log(data)
    console.log(data.content)

    var node = document.createElement("p");
    node.innerHTML = data.content
    // el = document.getElementById("hi").appendChild(node);
    var el = document.getElementById("hi")
    el.appendChild(node)
    // el.outerHTML = "<div class='newsletter-success animated fadeIn'><p>🎉 Thanks for signing up!</p></div>";
    location.reload();
  }
});
