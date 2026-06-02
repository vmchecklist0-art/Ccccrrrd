new Vue({
  el: '#app',
  components: {
    'icon': { template: '<svg><use :xlink:href="use"/></svg>', props: ['use'] } },

  data() {
    return {
      modal: false,
      items: [],
      dropdown: { height: 0 },
      filters: { routes: {}, locations: {}, kilometer: {} },
      menus: { routes: false, locations: false, kilometer: false }
    };
  },

  computed: {
    activeMenu() {
      return Object.keys(this.menus).reduce(($$, set, i) => this.menus[set] ? i : $$, -1);
    },

    list() {
      let { routes, locations } = this.activeFilters;

      return this.items.filter(({ route, location }) => {
        if (routes.length && !~routes.indexOf(route)) return false;
        return !locations.length || locations.indexOf(location) !== -1;
      });
    },

    activeFilters() {
      let { routes, locations, kilometer } = this.filters;

      return {
        routes: Object.keys(routes).filter(c => routes[c]),
        locations: Object.keys(locations).filter(c => locations[c]),
        kilometer: Object.keys(kilometer).filter(c => kilometer[c])
      };
    }
  },

  watch: {
    activeMenu(index, from) {
      if (index === from) return;

      this.$nextTick(() => {
        if (!this.$refs.menu || !this.$refs.menu[index]) {
          this.dropdown.height = 0;
        } else {
          this.dropdown.height = `${this.$refs.menu[index].clientHeight + 16}px`;
        }
      });
    }
  },

  methods: {
    setFilter(filter, option) {
      this.filters[filter][option] = !this.filters[filter][option];
    },

    clearFilter(filter, except, active) {
      Object.keys(this.filters[filter]).forEach(option => {
        this.filters[filter][option] = except === option && !active;
      });
    },

    clearAllFilters() {
      Object.keys(this.filters).forEach(filter => {
        Object.keys(this.filters[filter]).forEach(option => {
          this.filters[filter][option] = false;
        });
      });
    },

    setMenu(menu, active) {
      Object.keys(this.menus).forEach(tab => {
        this.menus[tab] = !active && tab === menu;
      });
    },

    initLightGallery() {
      this.$nextTick(() => {
        this.items.forEach(item => {
          const galleryElement = document.getElementById('gallery-' + item.id);
          if (galleryElement && !galleryElement.hasOwnProperty('lightGallery')) {
            lightGallery(galleryElement, {
              plugins: [lgThumbnail],
              thumbnail: true,
              selector: 'a',
              speed: 300,
              licenseKey: 'D4E2FA23-B7B211EE-8119E09E-4202FB86'
            });
          }
        });
      });
    }
  },

  beforeMount() {
    // Sample data with a single gallery card and one image
    this.items = [
      {
        id: 1,
        route: 'Alpine Pass',
        location: 'Swiss Alps',
        km: '12.3 Km',
        images: [
          { thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', width: 800, height: 600, alt: 'Mountain View' }
        ]
      }
    ];

    // Initialize filters
    this.items.forEach(({ route, location }) => {
      this.$set(this.filters.routes, route, false);
      this.$set(this.filters.locations, location, false);
    });

    this.initLightGallery();
  },

  updated() {
    this.initLightGallery();
  }
});