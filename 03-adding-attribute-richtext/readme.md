# Build a Basic Block using plain JavaScript

## Part 3: Adding Attributes and the RichText component

### Attributes

[Attributes](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/) are pieces of data that is stored in the block's markup. Defining block attributes allows you to develop blocks that your user's can edit. 

Block attributes are defined in the block metadata in the `block.json` file, and then passed to the `edit` and `save` functions. 

By default, the `edit` and `save` functions receive a number of properties through an object argument, and the attributes are part of that argument. To access the object, you add a function parameter to your `edit` or `save` function. Typically the parameter is called `props`, but you can call it anything you want.

```js
edit: function ( props ) {
    // rest of edit function code
}
```

Then, you can access the attributes by using the `props.attributes` property. 

```js
edit: function ( props ) {
    var attributes = props.attributes;
}
```

### Defining Attributes

To define an [attribute](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/), you create a new top level property in the `block.json` file called `attributes`. The `attributes` property is an object, and can have multiple items. Each item is a single attribute, and the value is another object which contains the attribute definition. Individual attributes must have at least a `type` field or an `enum` field. The simplest attribute would look like this:

```json
  "attributes": {
    "content": {
      "type": "string"
    }
  },
```

This creates a single attribute called `content`, and the type of the attribute is a string.

### Using the attribute in the RichText component

In the first two steps of building this block, you created a block element using a `p` (or paragraph) tag. However, it would be ideal to use something that makes it possible for the user to edit the content, and save the edited content to be rendered on the front end. You could do this by changing the `p` tag to a `textarea`, which would render an editable HTML textarea.

However, WordPress core ship with a RichText component, which can be set to render a `p` tag, but has a host of additional capabilities, like the ability to apply bold and italic to text, or assign a clickable link. The RichText component is a wrapper around the [contenteditable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content) HTML attribute.

You don't need to do anything special to access the  in the `save` function. 

### Implementing the RichText component

The first step is to add the replace the `p` tag in the first paramter of the `el` function with the `RichText` component. RichText is part of the blockEditor module, so we can create a RichText variable to use in our block at the top of the file.

```js 
var RichText = blockEditor.RichText;
```

Then, in the edit component can replace the `p` tag with the `RichText` component. 

```js
return el( RichText, blockProps, 'Hello JavaScript World (from the editor).' );
```

However, if you test this code now, you will see the following error in the block editor:

```This block has encountered an error and cannot be previewed.```

If you open your browser developer tools, you will probably see the following logged to the console:

```Uncaught TypeError: children is not a function at RichTextWrapper```

This error is caused by the fact that you cannot assign children to a `RichText` component as you did with the `p` tag, and instead RichText expects a value to be passed to it. To pass a value to it, you would pass it in the JSON object passed as the second paramater to the `el` function. 

```js
{
    value: 'Hello JavaScript World (from the editor).'
}
```

However, you are already passing an object of properties in the blockProps object, so you need to add the value to that object. You can do this using the [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) JavaScript function. When you add the value property, you can also remove the third parameter from the `el` function.

```js
return el(
    RichText,
    Object.assign( blockProps, {
        value: 'Hello JavaScript World (from the editor).'
    } )
);
```

At the same time, it's also require that you give the `RichText` component a `tagName` value, which you also pass into the element properties object. The tagName defines the element output, so set it to `p`.

```js
return el(
    RichText,
    Object.assign( blockProps, {
        tagName: 'p',
        value: 'Hello JavaScript World (from the editor).'
    } )
);
```

### Using the block attribute

Now that you have the RichText compenent in place in your edit funciton, you can replace the value with the value of the content attribute. Before you to that, it would be a good idea to update the attribute to have a default value, which you can do by assinging a "default" item in the attribute in block.json

```json
  "attributes": {
    "content": {
      "type": "string"
      "default": "Hello JavaScript World (from the editor)."
    }
  },
```

Now you can replace the value in the `el` function with the content attribute.

```js
return el(
    RichText,
    Object.assign( blockProps, {
        tagName: 'p',
        value: props.attributes.content
    } )
);
```

If you test this block in the block editor, it should render correct, but if you try and edit the text, you'll get an error in the console:

```Uncaught TypeError: adjustedOnChange is not a function```

This is because the RichText component expects an `onChange` function to be passed to it. The `onChange` function is called whenever the user changes the text in the RichText component. The `onChange` function is passed the new value of the text, and you can use that value to update the attribute.

First, you can assign a function name to the `onChange` property in the blockProps object. You can call the function whatever you want, but this example uses `onChangeContent`.

```js
return el(
    RichText,
    Object.assign( blockProps, {
        tagName: 'p',
        value: props.attributes.content, 
        onChange: onChangeContent
    } )
);
```

Then you need to define your onChangeContent function. For now, you can define just above the return statement in the `edit` function.

```js
function onChangeContent( newContent ) {
    // do something with newContent
}
```

Testing this code won't show any errors, but it would be ideal if we could update the `content` attributes value with the new value of the text as the user edits the block.

### Updating the block attribute with setAttributes

In order to do this, you can use the setAttributes function that is passed in the `props` object that the edit function receives.. The `setAttributes` function is used to update the attributes of the block. You can pass an object to the `setAttributes` function, and each key in the object will be the name of the attribute to update, and the value will be the new value of the attribute.

To use the `setAttributes` function, you can access it in the `onChangeContent` function from the props object.

```js
function onChangeContent( newContent ) {
    props.setAttributes( { content: newContent } );   
}
```

Now, when you edit the text in the block, the `content` attribute will be updated with the new value of the text.

### Implementing RichText and the block attribute in the save function

The last step is to implement the RichText component in the `save` function, and pass it the block attribute, so that when the block is saved, it will save the edited text, and the RichText output. 

As before, add the props parameter to the `save` function, and replace the `p` tag with the RichText component.

```js
save: function (props) {
```

Then, update the return with the `RichText.Content` instead of the `p` tag, and assign the tagName and value properties to the `blockProps` object.

```js
return el(
    RichText.Content,
    Object.assign( blockProps, {
        tagName: 'p',
        value: props.attributes.content,
    } )
);
```

Test this code in the block editor, and you should be able to edit the default text, and preview the changes on the front end.

### A little of refactoring

It's always a good idea, once you've written the first version of your code, to look at ways it could be improved. At this stage, there are two changes you can make

First, you can clean up some duplicated code. At the moment you have this in both your edit and save functions

```js
var blockProps = blockEditor.useBlockProps();
```

However, you can assign the `blockEditor.useBlockProps` hook to a variable at the top of the IIFE, just under where you created the RichText variable.

```js
var RichText = blockEditor.RichText;
var useBlockProps = blockEditor.useBlockProps;
```

Now you can replace both instances of `var blockProps = blockEditor.useBlockProps();` with `var blockProps = useBlockProps();`.

Second, it would be ideal not have to type out tihngs like props.attributes.content or props.setAttributes whenever you need to access them from the `props` object. You can update the edit and save functions to use somehting called [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to make this easier.  

```js
edit: function ( { attributes, setAttributes } ) {
```

```js
save: function ( { attributes } ) {
```

Deconstructing the `props` object in this way allows you to access `attributes` and `setAttributes` directly, without having to type out `props.attributes` or `props.setAttributes`. So now anywhere you have `props.attributes` or `props.setAttributes`, you can replace it with `attributes` or `setAttributes`.

Last but not least, it would be a good idea to update the `content` attribute's definition in the `block.json` file, by adding the `source` (determines where data is stored in your content) and `selector` (the element that the data is stored in) items. These are not required in this case, where there is just one element using in the block, which is also the root element, but it becomes important when your block contains multiple elements which each have their own attributes.

```json
  "attributes": {
    "content": {
      "type": "string",
      "source": "html",
      "selector": "p",
      "default": "Hello JavaScript World (from the editor)."
    }
  },
```

```js
    "content": {
      "type": "string",
      "source": "html",
      "selector": "p",
      "default": "Hello JavaScript Block"
    }
```