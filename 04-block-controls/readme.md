# Build a Basic Block using plain JavaScript

## Part 4: Implementing Block Toolbar or Sidebar Controls

### Update the block wrapper

In order to prepare the block to add support for either toolbar or sidebar settings, first you need to update the main block element.

This is because any element you create using createElement must have a root element. This is specifically [a requirement of React elements](https://reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom).

When you start adding controls to the block, you will need to add them as children of the root element. Currently, the root element is the RichText component. So, ideally, you should add the RichText component as a child of a new root element.

In order to do this, you need to do the following:

1. Update the root element from being the RichText component to a div element.
2. Add the RichText component as a child of the div element.

At the same time, you will need to move the block properties that are specific to the RichText component to the RichText component. This means removing them from being assinged to blockProps, and instead assigning them to the RichText component.

Let's take a look at what this should look like:

```js
return el(
    'div',
    blockProps,
    el( RichText, {
        tagName: 'p',
        onChange: onChangeContent,
        value: attributes.content,
    } )
)
```

1. The first argument to the el function is the element type. In this case, it is a div element.
2. The second argument is the props object. In this case, it is the blockProps object. This makes sure all the relevant properties (like the class) are applied to the root element, in this case the div element.
3. The third argument is the children of the div. In this case, it is a new element created by createElement. For this element, pass in the RichText component as the type, and a custom object that contains the tagname, onChange event handler and value.

Next, you need to update the save function in the same way

```js
return el(
    'div',
    blockProps,
    el( RichText.Content, {
        tagName: 'p',
        value: props.attributes.content,
    } )
)
```

If you view this code in the block editor now, you'll see that the RichText component is inside a div element, but things like the class and other relevant properties are applied to the root div element.