'use strict';

(function() {
  
  // Wait for DOM and libraries to be ready
  function init() {
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
      console.error('jQuery is not loaded');
      return;
    }
    
    var $ = jQuery;
    
    // Check if PhotoSwipe is available
    if (typeof PhotoSwipe === 'undefined' || typeof PhotoSwipeUI_Default === 'undefined') {
      console.error('PhotoSwipe library is not loaded');
      // Try again after a short delay
      setTimeout(init, 200);
      return;
    }

    console.log('PhotoSwipe libraries loaded, initializing gallery...');

    // Build gallery items array
    var items = [];
    $('#gallery figure').each(function() {
      var $link = $(this).find('a');
      if ($link.length) {
        var item = {
          src: $link.attr('href'),
          title: $link.data('caption') || ''
        };
        items.push(item);
      }
    });

    console.log('Found ' + items.length + ' gallery items');

    if (items.length === 0) {
      console.error('No gallery items found');
      return;
    }

    // Load images asynchronously to get dimensions
    items.forEach(function(item) {
      var img = new Image();
      img.onload = function() {
        item.w = this.naturalWidth || this.width;
        item.h = this.naturalHeight || this.height;
      };
      img.onerror = function() {
        console.warn('Failed to load image:', item.src);
      };
      img.src = item.src;
    });

    // Set up click handlers
    $('#gallery a').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Gallery item clicked');

      var $figure = $(this).closest('figure');
      var clickedIndex = $('#gallery figure').index($figure);
      
      console.log('Clicked index:', clickedIndex);

      if (clickedIndex < 0 || clickedIndex >= items.length) {
        console.error('Invalid index:', clickedIndex, 'Items length:', items.length);
        return false;
      }

      var pswpElement = document.querySelector('.pswp');
      if (!pswpElement) {
        console.error('PhotoSwipe element (.pswp) not found in DOM');
        return false;
      }

      console.log('Initializing PhotoSwipe with index:', clickedIndex);

      var options = {
        index: clickedIndex,
        bgOpacity: 0.85,
        showHideOpacity: true
      };

      try {
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        console.log('PhotoSwipe initialized successfully');
      } catch (error) {
        console.error('PhotoSwipe initialization error:', error);
        console.error('Error details:', error.message, error.stack);
      }
      
      return false;
    });
    
    console.log('Click handlers attached to gallery links');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }

})();
