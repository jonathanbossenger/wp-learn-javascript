# Build a Basic Block using plain JavaScript

## Part 4: Implementing Block Toolbar or Sidebar Controls

The Block Toolbar and Settings Sidebar are two predefined areas where you can add user facing controls to your blocks. 

Depending on your editor settings, the toolbar either appears directly above the block, or at the top of the editor. The sidebar usually appears to the right of the block editor, and can be enabled or disable from the toolbar

Toolbar and Sidebar controls for a block are added to each individual block, and included in the return value of the `edit` function. Typically, you would add Toolbar or Sidebar controls, and the block elements themselves, as children of a single parent element. 

This is because any element you create using createElement must have a single root element. This is specifically [a requirement of React elements](https://reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom).

Up till now, you've been using a single `p` tag as the root element for your block. This is fine for simple blocks, but if you want to add controls, you'll need to update things a little first.

### Update the block wrapper

In order to do this, you need to do the following:

1. Update the root element from the RichText component to a `div` element.
2. Add the RichText component as a child of the div element.

Any "container" HTML element will do, but a `div` is the most common.

At the same time, you will need to move the block properties that are specific to the RichText component to the RichText component. This means removing them from being assigned to blockProps, and instead assigning them to the RichText component.

Let's take a look at what this should look like:

```js
return el(
    'div',
    blockProps,
    el( RichText, 
        {
            tagName: 'p',
            onChange: onChangeContent,
            value: attributes.content,
        }
    )
)
```

1. The first argument to the `el` function is the element type. In this case, it is a `div` element.
2. The second argument is the blockProps object. This makes sure all the relevant properties (like the class) are applied to the root element, which is now the div element.
3. The third argument is any children of the root element. In this case, it is a new element created by createElement. For this new element, pass in the RichText component as the type, and a custom object that contains the tagname, onChange event handler and value.

Notice how you've moved the `tagName`, `onChange` and `value` properties from the blockProps object to the RichText component. This is because these properties are specific to implementation of the RichText component, and not the root element of the block. Notice also that blockProps remains the object passed as the properties for the root element. 

Next, you need to update the save function in the same way

```js
return el(
    'div',
    blockProps,
    el( RichText.Content, 
        {
            tagName: 'p',
            value: props.attributes.content,
        }
    )
)
```

If you view this code in the block editor now, you'll see that the RichText component is now inside a `div` element, but things like the class and other relevant properties are applied to the root `div` element. If you edit the RichText element, the content attributes is still updated, and saved to be displayed on the front end.

### Fixing the styling

You will also notice that because the root `div` element now has the block class name, the styling in the style.css and editor.css files are applied to the div, and the RichText `p` has its own styling, which means the layout is off a little.

You can fix this by applying the following to blocks `p` tag in the style.css file

```css
.wp-block-wp-learn-javascript-javascript-block p {
    margin: 0;
}
```

In the editor.css, you need to be a bit more specific, targeting the `block-editor-rich-text__editable` class applied to the `p` tag inside the editor

```css
.wp-block-wp-learn-javascript-javascript-block p.block-editor-rich-text__editable {
    margin: 0;
}
```

### Adding BlockControls and the AlignmentControl

Now that you've updated the block wrapper, you can add a control to the Toolbar. If you have a look at [the block-editor package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/), you'll see that there are a number of predefined controls that you can add to the Toolbar. To make life easy, let's pick one of the first ones, the [AlignmentControl](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/alignment-control/README.md).

The AlignmentControl is a component that allows you to add alignment controls to the Toolbar. It is a very simple component, and all you need to do is pass in the current alignment value, and an onChange event handler. The onChange event handler is called whenever the user changes the alignment, and is passed the new alignment value.

To implement the AlignmentControl, you also need to use the [BlockControls](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#blockcontrols) component. This is a component that allows you to add controls to the Toolbar. It is a wrapper component, and you pass in the controls you want to add as children.

To start, set up the BlockControls and AlignmentControl variables at the top of the file. This will allow you to create elements based on these two components.

```js
var BlockControls = blockEditor.BlockControls;
var AlignmentControl = blockEditor.AlignmentControl;
```

Next, add an element of type BlockControls as a child of the root `div`, before the RichText element. 

```js
return el(
    'div',
    blockProps,
    el( BlockControls, 
        {}
    ),
    el( RichText,
        {
            tagName: 'p',
            onChange: onChangeContent,
            value: attributes.content,
        }
    )
)
```

Notice how you can add multiple children to the root element, as long as they are comma delimited.

Then, add a new element of type `AlignmentControl` as a child of the `BlockControls` element. 

```js
return el(
    'div',
    blockProps,
    el( BlockControls,
        {},
        el( AlignmentControl, 
            {}
        )
    ),
    el( RichText,
        {
            tagName: 'p',
            onChange: onChangeContent,
            value: attributes.content,
        }
    )
)
```

If you test this in the editor, you'll see the AlignmentControl added to the Toolbar. However if you try and use it to change alignment, you'll get an error in the console, and nothing happens. 

### Adding alignment attribute, passing it to the AlignmentControl, and implementing an onChange handler

So the next step is to add an attribute to store the value, pass this attribute as the value of the AlignmentControl, and add an onChange event handler to the AlignmentControl to update the value.

In the block.json file, you can now add a new alignment attribute, under the content attribute. Make it a string type, and give it a deafult value of `none`.

```json
    "alignment": {
      "type": "string",
      "default": "none"
    }
```

Next, pass this as the value of the AlignmentControl, and add an onChange event handler to update the value.

```js
el( AlignmentControl, 
    {
        value: attributes.alignment,
        onChange: onChangeAlignment,
    }
)
```

Lastly, create the onChangeAlignment function to accept the new value, and update the attribute.

```js
function onChangeAlignment( newAlignment ) {
    setAttributes( { alignment: newAlignment === undefined ? 'none' : newAlignment } );
}
```

While also updated the alignment attribute, this function will also check if the newAlignment value is undefined, and if it is, set the alignment to `none`. This is because the AlignmentControl component will pass `undefined` as the value when the user clicks the same alignment button again, to remove the current alignment.

If you test this in the editor, you'll see errors have stopped, but no alignment is being applied. This is because we need to pass the alignment value to the `style` property of the RichText element. 

```js
el( RichText, 
    {
        tagName: 'p',
        style: { 
            textAlign: attributes.alignment 
        },
        onChange: onChangeContent,
        value: attributes.content,
    }
)
```

Test this out, and you'll see the RichText content can now be aligned.

### Update the save function use the alignment

The final step is to update the save function to use the alignment attribute. This is done in the same way as the content attribute, by passing the alignment value to the `style` property of the RichText element.

```js
return el(
    'div',
    blockProps,
    el( RichText.Content, {
        tagName: 'p',
        style: { textAlign: props.attributes.alignment },
        value: props.attributes.content,
    } )
);
```

You should now be able to see your block alignment when the block content is previewed or saved.

### A little experiment.

For fun, try changing the implementations of `BlockControls` to `InspectorControls`. `InspectorControls` is the component that allows you to add controls to the sidebar. If you simply replace all instances of `BlockControls` with `InspectorControls`, you'll see the AlignmentControl remove dform the toolbar and added to the sidebar. In this case, the AlignmentControl doesn't look great in the sidebar, but shows how you can add the same components to both the  `BlockControls` and `InspectorControls` components to add controls to the Toolbar and Sidebar.

### Minor refactoring

While we're talking about Toolbars and Sidebars, in the Plain Javascript example code for adding Toolbar and Sidebar controls across the WordPress Block Editor documenation, a `key` property is passed to the properties object for `BlockControls` and `InspectorControls`.

```js
{ key: 'controls' }
```

This is a specific React property, and help React identify which items have [changed, are added, or are removed](https://reactjs.org/docs/lists-and-keys.html#keys). When adding `BlockControls` it's recommended to include a key of 'controls' and when adding `InspectorControls` it's recommended to include a key of 'settings'.