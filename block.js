( function ( blocks, element, blockEditor ) {
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;

    blocks.registerBlockType( 'wp-learn-javascript/javascript-block', {
        edit: function ( { attributes, setAttributes } ) {
            var blockProps = useBlockProps();

            function onChangeContent( newContent ) {
                setAttributes( { content: newContent } );
            }

            return el(
                'div',
                blockProps,
                el( RichText, {
                    tagName: 'p',
                    onChange: onChangeContent,
                    value: attributes.content,
                } )
            )
        },
        save: function (props) {
            var blockProps = useBlockProps.save();
            return el(
                'div',
                blockProps,
                el( RichText.Content, {
                    tagName: 'p',
                    value: props.attributes.content,
                } )
            );
        },
    } );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor );