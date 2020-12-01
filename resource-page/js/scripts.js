var $jq = jQuery.noConflict(); //Resolves the conflict between the JS libraries

/*---------------------------------------------- Drop down panel  -------------------------------------*/

function dropDownPanel(openMessage, closeMessage) {
  $jq("#drop-down-panel-trigger").click(function () {
    $jq("#drop-down-panel").slideToggle("slow");

    var triggerText = document.getElementById("drop-down-panel-trigger");
    if (triggerText.innerHTML === closeMessage) {
      triggerText.innerHTML = openMessage;
    } else {
      triggerText.innerHTML = closeMessage;
    }
  });
};
/*---------------------------------------------- END Drop down panel  -------------------------------------*/

/*---------------------------------------------- Filter Functionality  -------------------------------------*/

// To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "checkboxFilter".

var checkboxFilter = {
  // Declare any variables we will need as properties of the object
  $filters: null,
  $reset: null,
  groups: [],
  outputArray: [],
  outputString: '',

  // The "init" method will run on document ready and cache any jQuery objects we will need.
  init: function () {
    var self = this;

    self.$filters = $jq('#Filters');
    self.$reset = $jq('#Reset');
    self.$etqResources = $jq('#etq-resources');

    self.$filters.find('fieldset').each(function () {
      self.groups.push({
        $inputs: $jq(this).find('input'),
        active: [],
        tracker: false
      });
    });
    self.bindHandlers();
  },

  // The "bindHandlers" method will listen for whenever a form value changes. 
  bindHandlers: function () {
    var self = this;

    self.$filters.on('change', function () {
      self.parseFilters();
    });

    self.$reset.on('click', function (e) {
      e.preventDefault();
      self.$filters[0].reset();
      self.parseFilters();
    });

  },

  // The parseFilters method checks which filters are active in each group:
  parseFilters: function () {
    var self = this;

    // loop through each filter group and add active filters to arrays
    for (var i = 0, group; group = self.groups[i]; i++) {
      group.active = []; // reset arrays
      group.$inputs.each(function () {
        $jq(this).is(':checked') && group.active.push(this.value);
      });
      group.active.length && (group.tracker = 0);
    }
    self.concatenate();
  },

  // The "concatenate" method will crawl through each group, concatenating filters as desired:
  concatenate: function () {
    var self = this,
      cache = '',
      crawled = false,
      checkTrackers = function () {
        var done = 0;
        for (var i = 0, group; group = self.groups[i]; i++) {
          (group.tracker === false) && done++;
        }
        return (done < self.groups.length);
      },
      crawl = function () {
        for (var i = 0, group; group = self.groups[i]; i++) {
          group.active[group.tracker] && (cache += group.active[group.tracker]);

          if (i === self.groups.length - 1) {
            self.outputArray.push(cache);
            cache = '';
            updateTrackers();
          }
        }
      },
      updateTrackers = function () {
        for (var i = self.groups.length - 1; i > -1; i--) {
          var group = self.groups[i];

          if (group.active[group.tracker + 1]) {
            group.tracker++;
            break;
          } else if (i > 0) {
            group.tracker && (group.tracker = 0);
          } else {
            crawled = true;
          }
        }
      };

    self.outputArray = []; // reset output array

    do {
      crawl();
    }
    while (!crawled && checkTrackers());

    self.outputString = self.outputArray.join();

    // If the output string is empty, show all rather than none:
    !self.outputString.length && (self.outputString = 'all');

    //console.log(self.outputString); 

    // ^ we can check the console here to take a look at the filter string that is produced
    // Send the output string to MixItUp via the 'filter' method:
    if (self.$etqResources.mixItUp('isLoaded')) {
      self.$etqResources.mixItUp('filter', self.outputString);
    }
  }
};

// On document ready, initialise our code.
$jq(function () {

  // Initialize checkboxFilter code
  checkboxFilter.init();

  // Instantiate MixItUp
  $jq('#etq-resources').mixItUp({
    controls: {
      enable: false // we won't be needing these
    },
    animation: {
      easing: 'cubic-bezier(0, 0, 0, 0)',
      duration: 600
    }
  });
});

/*---------------------------------------------- END Filter Functionality  -------------------------------------*/

/*---------------------------------------------- Lazy Load Images  -------------------------------------*/

"use strict";

// require('intersection-observer')
var options = {
  lazyParentClass: '.lazy-load--item',
  lazyItemClass: 'img'
};
var lazyLoadParents = document.querySelectorAll(options.lazyParentClass);
var lazyLoad = new IntersectionObserver(function (entries) {
  entries.map(function (entry) {
    // check if observed entry is intersecting
    if (!entry.isIntersecting) return false; // target = intersected element

    var img = entry.target.querySelector(options.lazyItemClass);

    if (img) {
      if (img.dataset.srcset) {
        // move data-srcset to srcset
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }

      if (img.dataset.src) {
        // move data-src to src
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      } // wait for image to load and addClass to fade in


      img.onload = function () {
        return img.classList.add('loaded');
      };
    }
  });
});
lazyLoadParents.forEach(function (item) {
  // add items to IntersectionObserver
  lazyLoad.observe(item);
});

/*---------------------------------------------- END Lazy Load Images  -------------------------------------*/


/*----------------------------------------------  Webinar Slideout  -------------------------------------*/

this.$slideOut = $jq('#webinarSlideOut');

// Slideout show
this.$slideOut.find('.slideOutTab').on('click', function() {
  $jq("#webinarSlideOut").toggleClass('hideSlideOut');
  $jq(".slideOutTab").toggleClass('plusSign');
});

/*---------------------------------------------- END Webinar Slideout  -------------------------------------*/