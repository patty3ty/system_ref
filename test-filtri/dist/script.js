ko.components.register('product-filter', {
    viewModel: function(params) {
      var self = this;
      self.dataoptions = params.dataoptions;
      self.label = ko.observable(params.label);
      self.id = ko.observable(params.id);
      self.value = params.value;
      self.elementId = function() {
        return "filter-"+self.id();
      }
      self.disabled = ko.computed(function() {return  params.dataoptions().length == 0});
    },
    template: '<div>\
    <select class="form-control" data-bind="disable: disabled, options: dataoptions, optionsCaption: label, value: value"></select>\
</div>'/*
  <!--<input type="text" class="form-control" data-bind="textInput: value, attr: {placeholder: label, list: elementId()}"  />\
       <datalist data-bind="attr: {id: elementId()}">\
      <!-- ko foreach: dataoptions-->\
      <option data-bind="value: $data, text: $data"></option>\
      <!-- /ko -->\
      </datalist>\
-->\
*/
});




var VM_DataResults = function() {
  // ajax etc.etc.
  var self = this;
  
  self.data = ko.observableArray([]);
  self.update = function(filters, query) {
    
   var wasFiltered = false;
   var products = window.data.products;
  
    
   if (!filters.empty()) {
     products = _.where(products, filters.values()); 
     wasFiltered = true;
   } 
    
   if (query()) {
    // found query
     var searchTerm = query();

     products = products.filter(function(item) {
       var match = false;
       ['category', 'brand', 'collection', 'type', 'title'].forEach(function(field) {
        termMatches = item[field].toLowerCase().includes(searchTerm.toLowerCase());
        match = match || termMatches;
       });
       return match;
     });
     wasFiltered = true;
   }
    
   if (!wasFiltered) {
     products = window.data.categories;
   }
    
   self.data(products);
    
    
  }
}

var VM_SearchResult = function(data) {
  var self = this;
  var fields = ['caption', 'image', 'brand', 'title', 'category', 'collection', 'type'];
  
  fields.forEach(function(f) {
    var value = data[f] || '';
    //self[f] = ko.observable(value);
    self[f] = (value);
  });
  
  if (!self.caption) {
    self.caption = self.collection;
  }
  
  self.isCategory = ko.computed(function() {
    return (!self.title || self.title.length == 0);
  })
  
}

var VM_Filters = function(categories, types, brands, collections) {
  var self = this;
  
  self.categories = ko.observableArray(categories || []);
  self.types = ko.observableArray(types || []);
  self.brands = ko.observableArray(brands || []);
  self.collections = ko.observableArray(collections || []);
}

var VM_SelectedFilters = function() {
  var self = this;
  
  self.category = ko.observable('');
  self.type = ko.observable('');
  self.brand = ko.observable('');
  self.collection = ko.observable('');

  self.values = ko.computed(function() {
    var values = {};
    var found = false;
    ['category', 'type', 'brand', 'collection'].forEach(function(obj) { 
      if (self[obj]()) { 
        values[obj] = self[obj]();
        found = true;
      } 
    });
    
    if (found) {
      return values;
    }
    
    return false;
    
  });

  self.empty = ko.computed(function() {
     return !self.values();
  });
  
}

var VM = function() {
  var self = this;

  self.filters = new VM_Filters();
  
  self.selectedFilters = new VM_SelectedFilters();
  
  self.query = ko.observable('');

  self.setFilterData = function(filterName, options) {
    self.filters[filterName](options);
  }
  
  self.results = new VM_DataResults();
  
  self.fetchResults = function() {
    self.results.update(self.selectedFilters, self.query);
  }
  
  self.resetFilters = function() {
    self.query('');
    self.selectedFilters.category('');
  }
  
  self.updateFilters = function() {
    
    var selected_category = self.selectedFilters.category();
    if (selected_category) {
      var product_with_category = _.where(window.data.products, {'category': selected_category})
      var brands = _.pluck(product_with_category, 'brand');
      self.setFilterData('brands', _.uniq(brands));
    } else {
      self.setFilterData('brands', []);
    }
    
    var selected_brand = self.selectedFilters.brand();
    
    if (selected_brand) {
      var product_with_brand = _.where(window.data.products, {'category': selected_category, 'brand': selected_brand});
            
      var types = _.pluck(product_with_brand, 'type');
      self.setFilterData('types', _.uniq(types));
      var collections = _.pluck(product_with_brand, 'collection');
      self.setFilterData('collections', _.uniq(collections));
    } else {
      self.setFilterData('collections', []);
      self.setFilterData('types', []);
    }
    
    // finally fetchResults()
    self.fetchResults();
  }
  
  self.selectedFilters.category.subscribe(self.updateFilters);  
  self.selectedFilters.brand.subscribe(self.updateFilters);
  self.selectedFilters.type.subscribe(self.updateFilters);  
  self.selectedFilters.collection.subscribe(self.updateFilters);    
  self.query.subscribe(self.fetchResults);
  
  
  
}


window.data = {};
window.data.categories = [
    new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "FRIGORIFERI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "DIVANI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "PAVIMENTI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "SEDIE"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "SANITARI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "RIVESTIMENTI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "LAVATRICI"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"caption": "ILLUMINAZIONE"
	})  
];

window.data.products = [
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 3",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Wade"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "INTERNI",
		"title": "Nehru"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Ivan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Brianna"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 2",
		"type": "INTERNI",
		"title": "Noah"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Patrick"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Shannon"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Travis"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Hiram"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Uriel"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Velma"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Ronan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Rahim"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Salvador"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "ESTERNI",
		"title": "Finn"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Ifeoma"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "RUVIDO",
		"title": "Rooney"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "RUVIDO",
		"title": "Heidi"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "DA INCASSO",
		"title": "Quentin"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Joelle"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Timon"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "ESTERNI",
		"title": "Jayme"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Meredith"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "ESTERNI",
		"title": "Libby"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Aretha"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Devin"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Laith"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "DA INCASSO",
		"title": "Sierra"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Omar"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Mannix"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 1",
		"type": "DA INCASSO",
		"title": "Haviva"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 2",
		"type": "DA INCASSO",
		"title": "Joy"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Wyatt"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "LISCIO",
		"title": "Porter"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 2",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Price"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "INTERNI",
		"title": "Jaden"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "INTERNI",
		"title": "Joan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "DA INCASSO",
		"title": "Risa"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ARMANI",
		"collection": "CASA",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Cynthia"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Kalia"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Sawyer"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "DA INCASSO",
		"title": "Timon"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Fulton"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "LISCIO",
		"title": "Derek"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "LISCIO",
		"title": "Theodore"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "RUVIDO",
		"title": "Colton"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Keegan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "ESTERNI",
		"title": "Kennedy"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "LISCIO",
		"title": "Ferdinand"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Lyle"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "LISCIO",
		"title": "Plato"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Sasha"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Velma"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 2",
		"type": "INTERNI",
		"title": "Germaine"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "ESTERNI",
		"title": "Dacey"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 2",
		"type": "RUVIDO",
		"title": "Marshall"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Gil"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "LISCIO",
		"title": "Ivy"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "RUVIDO",
		"title": "Michael"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 2",
		"type": "DA INCASSO",
		"title": "Germaine"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 2",
		"type": "LISCIO",
		"title": "Colt"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "INTERNI",
		"title": "Anika"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Arsenio"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Octavius"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "DA INCASSO",
		"title": "Ethan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "RUVIDO",
		"title": "Mira"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "INTERNI",
		"title": "Seth"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Quinn"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 2",
		"type": "INTERNI",
		"title": "Pearl"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "ARMANI",
		"collection": "CASA",
		"type": "ESTERNI",
		"title": "Beau"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 2",
		"type": "RUVIDO",
		"title": "Holly"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "INTERNI",
		"title": "Dora"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "RUVIDO",
		"title": "Jennifer"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 2",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Brandon"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Regina"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ALMAS",
		"collection": "CASA",
		"type": "DA INCASSO",
		"title": "Jennifer"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Harding"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Astra"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "RUVIDO",
		"title": "Lysandra"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "James"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "ESTERNI",
		"title": "Clio"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "CASA",
		"type": "LISCIO",
		"title": "Ryder"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "DA INCASSO",
		"title": "Uta"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "BENTLEY",
		"collection": "COLLEZIONE 2",
		"type": "ESTERNI",
		"title": "Natalie"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "FRIGORIFERI",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "LISCIO",
		"title": "Vaughan"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "DA INCASSO",
		"title": "Mikayla"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "BENTLEY",
		"collection": "CASA",
		"type": "RUVIDO",
		"title": "Naomi"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SEDIE",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Malcolm"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "INTERNI",
		"title": "Jorden"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Bethany"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "LIBERA INSTALLAZIONE",
		"title": "Tarik"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Brielle"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "LISCIO",
		"title": "Tallulah"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ALMAS",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Sonya"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "DIVANI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE 1",
		"type": "RUVIDO",
		"title": "Yuli"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "RIVESTIMENTI",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Isaiah"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "ILLUMINAZIONE",
		"brand": "FENDI",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Veda"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "SANITARI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 2",
		"type": "RUVIDO",
		"title": "Ingrid"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "LAVATRICI",
		"brand": "FENDI",
		"collection": "COLLEZIONE 1",
		"type": "DA INCASSO",
		"title": "Dennis"
	}),
	new VM_SearchResult({
		"image": "http://placeimg.com/255/190/",
		"category": "PAVIMENTI",
		"brand": "ARMANI",
		"collection": "COLLEZIONE SEDIE",
		"type": "ESTERNI",
		"title": "Allen"
	})
];


function randomizeImage(collection, field) {
  var category = ['animals', 'architecture', 'tech', 'people', 'nature', 'any'];
  var number = ['grayscale', 'sepia', 'color'];
  
  for (var i=0, c=collection.length; i<c; i++) {
    var value = collection[i][field]+_.sample(category)+'/'+_.sample(number);
    value += '?'+(new Date().getTime());
    collection[i][field] = (value);
  }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

randomizeImage(window.data.categories, 'image');
randomizeImage(window.data.products, 'image');
window.app = new VM();
window.app.setFilterData('categories', window.data.categories.map(function(obj) { return obj.caption; }));
//app.selectedFilters.category('FRIGORIFERI');
window.app.fetchResults();
ko.applyBindings(app, document.getElementById('appfilters'));