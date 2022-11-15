(function (blocks, element, blockEditor) {
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;

    blocks.registerBlockType('wp-learn-javascript/javascript-block', {
        edit: function ({attributes, setAttributes}) {
            var blockProps = useBlockProps();

            function onChangeContent(newContent) {
                setAttributes({content: newContent});
            }

            return el(
                RichText,
                Object.assign(blockProps, {
                    tagName: 'p',
                    onChange: onChangeContent,
                    value: attributes.content,
                })
            );
        },
        save: function ({attributes}) {
            var blockProps = useBlockProps.save();
            return el(
                RichText.Content,
                Object.assign(blockProps, {
                    tagName: 'p',
                    value: attributes.content,
                })
            );
        },
    });
})(window.wp.blocks, window.wp.element, window.wp.blockEditor);