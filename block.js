( function ( blocks, element, blockEditor ) {
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;

    var BlockControls = blockEditor.BlockControls;
    var AlignmentControl = blockEditor.AlignmentControl;

    blocks.registerBlockType( 'wp-learn-javascript/javascript-block', {
        edit: function ( { attributes, setAttributes } ) {
            var blockProps = useBlockProps();
            function onChangeContent( newContent ) {
                setAttributes( { content: newContent } );
            }
            function onChangeAlignment( newAlignment ) {
                setAttributes( { alignment: newAlignment === undefined ? 'none' : newAlignment } );
            }

            return el(
                'div',
                blockProps,
                el( BlockControls,
                    {
                        key: 'controls'
                    },
                    el( AlignmentControl,
                        {
                            value: attributes.alignment,
                            onChange: onChangeAlignment,
                        }
                    )
                ),
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
            )
        },
        save: function (props) {
            var blockProps = useBlockProps.save();
            return el(
                'div',
                blockProps,
                el( RichText.Content,
                    {
                        tagName: 'p',
                        style: { textAlign: props.attributes.alignment },
                        value: props.attributes.content,
                    }
                )
            )
        },
    } );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor );