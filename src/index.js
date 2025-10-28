/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import {
        Button,
        ButtonGroup,
        PanelBody,
        PanelRow,
        ToggleControl,
        TextareaControl,
        __experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';
import {
	arrowRight,
	arrowLeft,
	chevronLeft,
	chevronLeftSmall,
	chevronRight,
	chevronRightSmall,
	cloud,
	cloudUpload,
	commentAuthorAvatar,
	download,
	external,
	help,
	info,
	lockOutline,
	login,
	next,
	previous,
	shuffle,
	wordpress,
} from '@wordpress/icons';

/**
 * All available icons.
 * (Order determines presentation order)
 */
export const ICONS = [
        {
                label: __( 'Chevron Right', 'enable-button-icons' ),
                value: 'chevron-right',
                icon: chevronRight,
	},
	{
		label: __( 'Chevron Left', 'enable-button-icons' ),
		value: 'chevron-left',
		icon: chevronLeft,
	},
	{
		label: __( 'Chevron Right (Small)', 'enable-button-icons' ),
		value: 'chevron-right-small',
		icon: chevronRightSmall,
	},
	{
		label: __( 'Chevron Left (Small)', 'enable-button-icons' ),
		value: 'chevron-left-small',
		icon: chevronLeftSmall,
	},
	{
		label: __( 'Shuffle', 'enable-button-icons' ),
		value: 'shuffle',
		icon: shuffle,
	},
	{
		label: __( 'Arrow Right', 'enable-button-icons' ),
		value: 'arrow-right',
		icon: arrowRight,
	},
	{
		label: __( 'Arrow Left', 'enable-button-icons' ),
		value: 'arrow-left',
		icon: arrowLeft,
	},
	{
		label: __( 'Next', 'enable-button-icons' ),
		value: 'next',
		icon: next,
	},
	{
		label: __( 'Previous', 'enable-button-icons' ),
		value: 'previous',
		icon: previous,
	},
	{
		label: __( 'Download', 'enable-button-icons' ),
		value: 'download',
		icon: download,
	},
	{
		label: __( 'External Arrow', 'enable-button-icons' ),
		value: 'external-arrow',
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polygon points="18 6 8.15240328 6 8.15240328 8.1101993 14.3985932 8.1101993 6 16.5087925 7.4912075 18 15.8898007 9.6014068 15.8898007 15.8475967 18 15.8475967"></polygon>
			</svg>
		),
	},
	{
		label: __( 'External', 'enable-button-icons' ),
		value: 'external',
		icon: external,
	},
	{
		label: __( 'Login', 'enable-button-icons' ),
		value: 'login',
		icon: login,
	},
	{
		label: __( 'Lock', 'enable-button-icons' ),
		value: 'lock-outline',
		icon: lockOutline,
	},
	{
		label: __( 'Avatar', 'enable-button-icons' ),
		value: 'comment-author-avatar',
		icon: commentAuthorAvatar,
	},
	{
		label: __( 'Cloud', 'enable-button-icons' ),
		value: 'cloud',
		icon: cloud,
	},
	{
		label: __( 'Cloud Upload', 'enable-button-icons' ),
		value: 'cloud-upload',
		icon: cloudUpload,
	},
	{
		label: __( 'Help', 'enable-button-icons' ),
		value: 'help',
		icon: help,
	},
	{
		label: __( 'Info', 'enable-button-icons' ),
		value: 'info',
		icon: info,
	},
	{
		label: __( 'WordPress', 'enable-button-icons' ),
		value: 'wordpress',
		icon: wordpress,
        },
];

/**
 * Convert SVG markup into a CSS-ready data URI string.
 *
 * @param {string} svg The raw SVG markup.
 * @return {string} A data URI representation of the SVG.
 */
const encodeSvgForCss = ( svg ) => {
        if ( ! svg ) {
                return '';
        }

        const cleanedSvg = svg
                .replace( /[\r\n\t]+/g, ' ' )
                .replace( />\s+</g, '><' )
                .trim();

        if ( ! cleanedSvg ) {
                return '';
        }

        return `url("data:image/svg+xml;utf8,${ encodeURIComponent( cleanedSvg )
                .replace( /'/g, '%27' )
                .replace( /"/g, '%22' ) }")`;
};

/**
 * Add the attributes needed for button icons.
 *
 * @since 0.1.0
 * @param {Object} settings
 */
function addAttributes( settings ) {
	if ( 'core/button' !== settings.name ) {
		return settings;
	}

	// Add the block visibility attributes.
	const iconAttributes = {
                icon: {
                        type: 'string',
                },
                iconSource: {
                        type: 'string',
                        default: 'library',
                },
                customIconSvg: {
                        type: 'string',
                },
                iconPositionLeft: {
                        type: 'boolean',
                        default: false,
                },
		justifySpaceBetween: {
			type: 'boolean',
			default: false,
		},
	};

	const newSettings = {
		...settings,
		attributes: {
			...settings.attributes,
			...iconAttributes,
		},
	};

	return newSettings;
}

addFilter(
	'blocks.registerBlockType',
	'enable-button-icons/add-attributes',
	addAttributes
);

/**
 * Filter the BlockEdit object and add icon inspector controls to button blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		if ( props.name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}

                const { attributes, setAttributes } = props;
                const {
                        icon: currentIcon,
                        iconSource = 'library',
                        customIconSvg = '',
                        iconPositionLeft,
                        justifySpaceBetween,
                } = attributes;

                const isCustomIconSource = iconSource === 'custom';

                const handleSelectLibrary = () => {
                        if ( iconSource !== 'library' ) {
                                setAttributes( { iconSource: 'library' } );
                        }
                };

                const handleSelectCustom = () => {
                        if ( iconSource !== 'custom' ) {
                                setAttributes( {
                                        iconSource: 'custom',
                                        icon: customIconSvg ? 'custom' : null,
                                } );
                        }
                };

                const handleCustomSvgChange = ( value ) => {
                        setAttributes( {
                                customIconSvg: value,
                                iconSource: 'custom',
                                icon: value ? 'custom' : null,
                        } );
                };

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon settings', 'enable-button-icons' ) }
						className="button-icon-picker"
						initialOpen={ true }
					>
                                                <PanelRow>
                                                        <ButtonGroup>
                                                                <Button
                                                                        variant={
                                                                                isCustomIconSource
                                                                                        ? 'secondary'
                                                                                        : 'primary'
                                                                        }
                                                                        onClick={ handleSelectLibrary }
                                                                >
                                                                        { __( 'Icon library', 'enable-button-icons' ) }
                                                                </Button>
                                                                <Button
                                                                        variant={
                                                                                isCustomIconSource
                                                                                        ? 'primary'
                                                                                        : 'secondary'
                                                                        }
                                                                        onClick={ handleSelectCustom }
                                                                >
                                                                        { __( 'Custom SVG', 'enable-button-icons' ) }
                                                                </Button>
                                                        </ButtonGroup>
                                                </PanelRow>
                                                <PanelRow>
                                                        { ! isCustomIconSource && (
                                                                <Grid
                                                                        className="button-icon-picker__grid"
                                                                        columns="5"
                                                                        gap="0"
                                                                >
                                                                        { ICONS.map( ( icon, index ) => (
                                                                                <Button
                                                                                        key={ index }
                                                                                        label={ icon?.label }
                                                                                        isPressed={
                                                                                                iconSource === 'library' &&
                                                                                                currentIcon === icon.value
                                                                                        }
                                                                                        className="button-icon-picker__button"
                                                                                        onClick={ () =>
                                                                                                setAttributes( {
                                                                                                        // Allow user to disable icons.
                                                                                                        icon:
                                                                                                                currentIcon === icon.value
                                                                                                                        ? null
                                                                                                                        : icon.value,
                                                                                                        iconSource: 'library',
                                                                                                        customIconSvg: '',
                                                                                                } )
                                                                                        }
                                                                                >
                                                                                        { icon.icon ?? icon.value }
                                                                                </Button>
                                                                        ) ) }
                                                                </Grid>
                                                        ) }
                                                        { isCustomIconSource && (
                                                                <div className="button-icon-picker__custom-svg">
                                                                        <TextareaControl
                                                                                label={ __( 'Custom SVG', 'enable-button-icons' ) }
                                                                                help={ __(
                                                                                        'Paste SVG code to use as a custom icon.',
                                                                                        'enable-button-icons'
                                                                                ) }
                                                                                value={ customIconSvg }
                                                                                onChange={ handleCustomSvgChange }
                                                                                rows={ 8 }
                                                                        />
                                                                        <Button
                                                                                variant="secondary"
                                                                                onClick={ () =>
                                                                                        setAttributes( {
                                                                                                customIconSvg: '',
                                                                                                icon: null,
                                                                                                iconSource: 'custom',
                                                                                        } )
                                                                                }
                                                                                disabled={ ! customIconSvg }
                                                                        >
                                                                                { __( 'Remove custom icon', 'enable-button-icons' ) }
                                                                        </Button>
                                                                </div>
                                                        ) }
                                                </PanelRow>
						<PanelRow className="button-icon-picker__settings">
							<ToggleControl
								label={ __(
									'Show icon on left',
									'enable-button-icons'
								) }
								checked={ iconPositionLeft }
								onChange={ () => {
									setAttributes( {
										iconPositionLeft: ! iconPositionLeft,
									} );
								} }
							/>
							<ToggleControl
								label={ __(
									'Justify space between',
									'enable-button-icons'
								) }
								checked={ justifySpaceBetween }
								onChange={ () => {
									setAttributes( {
										justifySpaceBetween: ! justifySpaceBetween,
									} );
								} }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'enable-button-icons/add-inspector-controls',
	addInspectorControls
);

/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses( BlockListBlock ) {
        return ( props ) => {
                const { name, attributes } = props;

                if ( 'core/button' !== name ) {
                        return <BlockListBlock { ...props } />;
                }

                const {
                        icon,
                        iconSource = 'library',
                        customIconSvg,
                        iconPositionLeft,
                        justifySpaceBetween,
                } = attributes ?? {};

                const isCustomSource = iconSource === 'custom';
                const hasCustomIcon = isCustomSource && customIconSvg;
                const iconSlug = isCustomSource ? 'custom' : icon;

                if ( ! iconSlug ) {
                        return <BlockListBlock { ...props } />;
                }

                const classes = classnames( props?.className, {
                        [ `has-icon__${ iconSlug }` ]: iconSlug,
                        'has-icon-position__left': iconPositionLeft,
                        'has-justified-space-between': justifySpaceBetween,
                } );

                const blockProps = {
                        ...props,
                        className: classes,
                };

                if ( hasCustomIcon ) {
                        const dataUri = encodeSvgForCss( customIconSvg );

                        if ( dataUri ) {
                                blockProps.style = {
                                        ...( props?.style ?? {} ),
                                        '--enable-button-icons-custom': dataUri,
                                };
                        }
                }

                return <BlockListBlock { ...blockProps } />;
        };
}

addFilter(
	'editor.BlockListBlock',
	'enable-button-icons/add-classes',
	addClasses
);
