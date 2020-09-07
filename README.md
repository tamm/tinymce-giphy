# tinymce-giphy

This is so far a POC of integration between TinyMCE 5 and the Giphy API.

Note: Giphy suggests using their SDK rather than API, and the included key is a rate limited beta key.

This also demonstrates how you can use the TinyMCE Dialog Collection component to select an image. 

## Getting set up

Install and import as 
```
import 'tinymce-giphy';
```

Then add to TinyMCE config as

```
plugins: [
    'giphy'
],
toolbar:
    `giphy`
```

## License

As TinyMCE is GPL, this is GPL. 
Please consider this if you reuse the code in any way.