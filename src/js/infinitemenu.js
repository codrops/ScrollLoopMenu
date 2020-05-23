const winsize = {width: window.innerWidth, height: window.innerHeight};

export default class InfiniteMenu {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.menuItems = [...this.DOM.el.querySelectorAll('.menu__item')];

        this.cloneItems();
        this.initScroll();

        this.initEvents();

        // rAF/loop
        requestAnimationFrame(() => this.render());
    }
    getScrollPos() {
        return (this.DOM.el.pageYOffset || this.DOM.el.scrollTop) - (this.DOM.el.clientTop || 0);
    }
    setScrollPos(pos) {
        this.DOM.el.scrollTop = pos;
    }
    // Create menu items clones and append them to the menu items list
    // total clones = number of menu items that fit in the viewport
    cloneItems() {
        // Get the height of one menu item
        const itemHeight = this.DOM.menuItems[0].offsetHeight;
        // How many items fit in the window?
        const fitIn = Math.ceil(winsize.height / itemHeight);
        // Create [fitIn] clones from the beginning of the list
        
        // Remove any
        this.DOM.el.querySelectorAll('.loop__clone').forEach(clone => this.DOM.el.removeChild(clone));
        // Add clones
        let totalClones = 0;
        this.DOM.menuItems.filter((_, index) => (index < fitIn)).map(target => {
            const clone = target.cloneNode(true);
            clone.classList.add('loop__clone');
            this.DOM.el.appendChild(clone);
            ++totalClones;
        });

        // All clones height
        this.clonesHeight = totalClones * itemHeight;
        // Scrollable area height
        this.scrollHeight = this.DOM.el.scrollHeight;
    }
    initEvents() {
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.cloneItems();
        this.initScroll();
    }
    initScroll() {
        // Scroll 1 pixel to allow upwards scrolling
        this.scrollPos = this.getScrollPos();
        if (this.scrollPos <= 0) {
            this.setScrollPos(1);
        }
    }
    scrollUpdate() {  
        this.scrollPos = this.getScrollPos();

        if ( this.clonesHeight + this.scrollPos >= this.scrollHeight ) {
            // Scroll to the top when you’ve reached the bottom
            this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
        } 
        else if ( this.scrollPos <= 0 ) {
            // Scroll to the bottom when you reach the top
            this.setScrollPos(this.scrollHeight - this.clonesHeight);
        }
    }
    render() {
        this.scrollUpdate();
        requestAnimationFrame(() => this.render());
    }
}