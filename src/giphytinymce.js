/*global giphyOptions*/

import tinymce from 'tinymce/tinymce';
import throttle from 'underscore/modules/throttle.js'
import './giphytinymce.css';

const giphyOptionsDefault = {
  apiBase: 'https://api.giphy.com/v1',
  apiKey: 'lBj9wdWfSYDszxMdstVhL6ODrxDLh8Xr', // https://developers.giphy.com/docs/api#quick-start-guide
  minimumCharactersToSearch: 3,
  throttleAPIRequestsMs: 300,
}

tinymce.PluginManager.add('giphy', function(editor, url) {
  const giphyOptionsCombined = typeof giphyOptions !== 'undefined' ? {...giphyOptionsDefault, ...giphyOptions} : {...giphyOptionsDefault};
  const openDialog = function () {
    return editor.windowManager.open({
      initialData: {
        'giphyCollection': [],
      },
      title: 'GIPHY',
      body: {
        type: 'panel',
        classes: 'giphyDialog',
        items: [
          {
            type: 'input',
            name: 'searchInput',
            label: 'Search'
          },
          {
            type: 'collection',
            name: 'giphyCollection',
            label: 'Search Results',
            columns: 1,
          },
        ]
      },
      buttons: [
        {
          type: 'cancel',
          text: 'Close'
        },
      ],
      onChange: throttle(function (api, changeData) {
        const data = api.getData();
        if (changeData.name === "searchInput" && data.searchInput.length >= giphyOptionsCombined.minimumCharactersToSearch) {
          const encodedSearch = encodeURIComponent(data.searchInput);
          const giphyRequest = fetch(`${giphyOptionsCombined.apiBase}/gifs/search?q=${encodedSearch}&api_key=${giphyOptionsCombined.apiKey}&limit=5`)
            .then(response => response.json())
            .then((response) => {
              if (response.data && typeof response.data === 'object') {
                api.setData({ 
                  giphyCollection: response.data.map(item => {return { value: item.images.original.url, icon: `<img src="${item.images.original.url}" />`, text: `Select ${item.title}`}}),
                });
              }
            });
        }
      }, giphyOptionsCombined.throttleAPIRequestsMs),
      onAction: function (api, changeData) {
        if (changeData.name === "giphyCollection") {
          // Extremely basic insertion of <img> tag, should probably be expanded on.
          editor.insertContent(`<img src="${changeData.value}" />`);
          api.close();
        }
      },
    });
  };

  // Add a button that opens a window
  editor.ui.registry.addButton('giphy', {
    text: 'GIPHY',
    onAction: function () {
      // Open window
      openDialog();
    }
  });

  // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
  editor.ui.registry.addMenuItem('giphy', {
    text: 'GIPHY',
    onAction: function() {
      // Open window
      openDialog();
    }
  });

  return {
    getMetadata: function () {
      return  {
        name: 'GIPHY',
        url: 'https://github.com/tamm/tinymce-giphy'
      };
    }
  };
});
