class ExtButton extends HTMLButtonElement {
    constructor() {
    super();

    /** Custom events go here
    this.addEventListener("click", () => {
      // Draw some fancy animation effects!
    });
    */
  }
}

class ExtCell extends

class ExtRow extends


class AppDrawer extends HTMLElement {

   constructor() {
       super();
   }
   createdCallback(){
        this.innerHTML = `<table><td><tr></tr></td></table>`;
        let table = this.querySelector('table');
        table.addEventListener('mouseover',() => alert('Over table'));
   }

   attachedCallback(){
   }

   set properties(prop) {
   }

   get text() {
   }
}
/**
https://developers.google.com/web/fundamentals/web-components/customelements
https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements
https://www.w3.org/TR/html5/tabular-data.html#the-table-element
https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements/Custom_Elements_with_Classes
*/

customElements.define('app-drawer', AppDrawer);
