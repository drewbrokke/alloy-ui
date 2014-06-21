/**
 * The Form Builder Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-base
 */

var L = A.Lang,
    isArray = L.isArray,
    isBoolean = L.isBoolean,
    isObject = L.isObject,
    isString = L.isString,

    aArray = A.Array,

    getAvailableFieldById = A.AvailableField.getAvailableFieldById,

    isAvailableField = function(v) {
        return (v instanceof A.AvailableField);
    },

    isFormBuilderField = function(v) {
        return (v instanceof A.FormBuilderField);
    },

    getCN = A.getClassName,

    AVAILABLE_FIELDS_ID_PREFIX = 'availableFields' + '_' + 'field' + '_',
    FIELDS_ID_PREFIX = 'fields' + '_' + 'field' + '_',

    CSS_DD_DRAGGING = getCN('dd', 'dragging'),
    CSS_DIAGRAM_BUILDER_FIELD_DRAGGABLE = getCN('diagram', 'builder', 'field', 'draggable'),
    CSS_FIELD_HOVER = getCN('form', 'builder', 'field', 'hover'),
    CSS_FORM_BUILDER_DROP_ZONE = getCN('form', 'builder', 'drop', 'zone'),
    CSS_FORM_BUILDER_FIELD = getCN('form', 'builder', 'field'),
    CSS_FORM_BUILDER_PLACEHOLDER = getCN('form', 'builder', 'placeholder'),

    TPL_PLACEHOLDER = '<div class="' + CSS_FORM_BUILDER_PLACEHOLDER + '"></div>',

    keyBackspace = 8,
    keyEnter = 13,
    keyEscape = 27,
    keyLeftArrow = 37,
    keyUpArrow = 38,
    keyRightArrow = 39,
    keyDownArrow = 40,
    keyDelete = 46,
    keyLowerC = 67,
    keyLowerD = 68,
    keyLowerE = 69,
    keyLowerF = 70,
    keyLowerJ = 74,
    keyLowerK = 75,
    keyLowerN = 78,
    keyNumberKeys = {
        48: 0,
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9,
    };

/**
 * A base class for `A.FormBuilderAvailableField`.
 *
 * @class A.FormBuilderAvailableField
 * @extends A.AvailableField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */

var FormBuilderAvailableField = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'availableField',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilderAvailableField`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * List of hidden attributes.
         *
         * @attribute hiddenAttributes
         * @type Array
         */
        hiddenAttributes: {
            validator: isArray
        },

        /**
         * The name of the input field.
         *
         * @attribute name
         */
        name: {},

        /**
         * Collection of options.
         *
         * @attribute options
         * @type Object
         */
        options: {
            validator: isObject
        },

        /**
         * Specifies a predefined value for the input field.
         *
         * @attribute predefinedValue
         */
        predefinedValue: {},

        /**
         * List of read-only input fields.
         *
         * @attribute readOnlyAttributes
         * @type Array
         */
        readOnlyAttributes: {
            validator: isArray
        },

        /**
         * Checks if an input field is required. In other words, it needs
         * content to be valid.
         *
         * @attribute required
         * @type Boolean
         */
        required: {
            validator: isBoolean
        },

        /**
         * If `true` the label is showed.
         *
         * @attribute showLabel
         * @default true
         * @type Boolean
         */
        showLabel: {
            validator: isBoolean,
            value: true
        },

        /**
         * Hint to help the user to fill the input field.
         *
         * @attribute tip
         * @type String
         */
        tip: {
            validator: isString
        },

        /**
         * Checks if the input field is unique or not.
         *
         * @attribute unique
         * @type Boolean
         */
        unique: {
            validator: isBoolean
        },

        /**
         * The width of the input field.
         *
         * @attribute width
         */
        width: {}
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type String
     * @static
     */
    EXTENDS: A.AvailableField
});

A.FormBuilderAvailableField = FormBuilderAvailableField;

/**
 * A base class for `A.FormBuilder`.
 *
 * @class A.FormBuilder
 * @extends A.DiagramBuilderBase
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 * @include http://alloyui.com/examples/form-builder/basic-markup.html
 * @include http://alloyui.com/examples/form-builder/basic.js
 */
var FormBuilder = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'form-builder',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilder`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Checks if removing required fields is permitted or not.
         *
         * @attribute allowRemoveRequiredFields
         * @default false
         * @type Boolean
         */
        allowRemoveRequiredFields: {
            validator: isBoolean,
            value: false
        },

        /**
         * Enables a field to be editable.
         *
         * @attribute enableEditing
         * @default true
         * @type Boolean
         */
        enableEditing: {
            value: true
        },

        /**
         * Collection of sortable fields.
         *
         * @attribute fieldsSortableListConfig
         * @default null
         * @type Object
         */
        fieldsSortableListConfig: {
            setter: '_setFieldsSortableListConfig',
            validator: isObject,
            value: null
        },

        /**
         * Collection of strings used to label elements of the UI.
         *
         * @attribute strings
         * @type Object
         */
        strings: {
            value: {
                addNode: 'Add field',
                close: 'Close',
                propertyName: 'Property Name',
                save: 'Save',
                settings: 'Settings',
                value: 'Value'
            }
        }

    },

    /**
     * Static property used to define the UI attributes.
     *
     * @property UI_ATTRS
     * @type Array
     * @static
     */
    UI_ATTRS: ['allowRemoveRequiredFields'],

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type String
     * @static
     */
    EXTENDS: A.DiagramBuilderBase,

    /**
     * Static property used to define the fields tab.
     *
     * @property FIELDS_TAB
     * @default 0
     * @type Number
     * @static
     */
    FIELDS_TAB: 0,

    /**
     * Static property used to define the settings tab.
     *
     * @property SETTINGS_TAB
     * @default 1
     * @type Number
     * @static
     */
    SETTINGS_TAB: 1,

    prototype: {

        selectedFieldsLinkedSet: null,
        uniqueFieldsMap: null,

        /**
         * Construction logic executed during `A.FormBuilder` instantiation.
         * Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.selectedFieldsLinkedSet = new A.LinkedSet({
                after: {
                    add: A.bind(instance._afterSelectedFieldsSetAdd, instance),
                    remove: A.bind(instance._afterSelectedFieldsSetRemove, instance)
                }
            });

            instance.uniqueFieldsMap = new A.Map({
                after: {
                    put: A.bind(instance._afterUniqueFieldsMapPut, instance),
                    remove: A.bind(instance._afterUniqueFieldsMapRemove, instance)
                }
            });

            instance.on({
                cancel: instance._onCancel,
                'drag:end': instance._onDragEnd,
                'drag:start': instance._onDragStart,
                'drag:mouseDown': instance._onDragMouseDown,
                save: instance._onSave
            });

            instance.after('*:focusedChange', instance._afterFieldFocusedChange);

            instance.dropContainer.delegate('click', A.bind(instance._onClickField, instance), '.' +
                CSS_FORM_BUILDER_FIELD);
            instance.dropContainer.delegate('mouseover', A.bind(instance._onMouseOverField, instance), '.' +
                CSS_FORM_BUILDER_FIELD);
            instance.dropContainer.delegate('mouseout', A.bind(instance._onMouseOutField, instance), '.' +
                CSS_FORM_BUILDER_FIELD);

            instance._bindKeypress();
        },

        /**
         * Sync the `A.FormBuilder` UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance._setupAvailableFieldsSortableList();
            instance._setupFieldsSortableList();
        },

        /**
         * Selects the field tab and disables the setting tabs.
         *
         * @method closeEditProperties
         */
        closeEditProperties: function() {
            var instance = this;

            instance.tabView.selectChild(A.FormBuilder.FIELDS_TAB);
            instance.tabView.disableTab(A.FormBuilder.SETTINGS_TAB);
        },

        /**
         * Creates a field and returns its configuration.
         *
         * @method createField
         * @param config
         * @return {Object}
         */
        createField: function(config) {
            var instance = this,
                attrs = {
                    builder: instance,
                    parent: instance
                };


            if (isFormBuilderField(config)) {
                config.setAttrs(attrs);
            }
            else {
                A.each(config, function(value, key) {
                    if (value === undefined) {
                        delete config[key];
                    }
                });

                config = new(instance.getFieldClass(config.type || 'field'))(A.mix(attrs, config));
            }

            config.addTarget(instance);

            return config;
        },

        /**
         * Gets the current field index and then clones the field. Inserts the
         * new one after the current field index, inside of the current field
         * parent.
         *
         * @method duplicateField
         * @param field
         */
        duplicateField: function(field) {
            var instance = this,
                index = instance._getFieldNodeIndex(field.get('boundingBox')),
                newField = instance._cloneField(field, true),
                boundingBox = newField.get('boundingBox');

            boundingBox.setStyle('opacity', 0);
            instance.insertField(newField, ++index, field.get('parent'));
            boundingBox.show(true);
        },

        /**
         * Checks if the current field is a `A.FormBuilderField` instance and
         * selects it.
         *
         * @method editField
         * @param field
         */
        editField: function(field) {
            var instance = this;

            if (isFormBuilderField(field)) {
                instance.editingField = field;

                instance.unselectFields();
                instance.selectFields(field);
            }
        },

        /**
         * Gets the field class based on the `A.FormBuilder` type. If the type
         * doesn't exist, logs an error message.
         *
         * @method getFieldClass
         * @param type
         * @return {Object | null}
         */
        getFieldClass: function(type) {
            var clazz = A.FormBuilder.types[type];

            if (clazz) {
                return clazz;
            }
            else {
                A.log('The field type: [' + type + '] couldn\'t be found.');

                return null;
            }
        },

        /**
         * Gets a list of properties from the field.
         *
         * @method getFieldProperties
         * @param field
         * @return {Array}
         */
        getFieldProperties: function(field, excludeHidden) {
            return field.getProperties(excludeHidden);
        },

        /**
         * Removes field from previous parent and inserts into the new parent.
         *
         * @method insertField
         * @param field
         * @param index
         * @param parent
         */
        insertField: function(field, index, parent) {
            var instance = this;

            parent = parent || instance;

            // remove from previous parent
            field.get('parent').removeField(field);

            parent.addField(field, index);
        },

        keyboardChooseProperty: function(field, attributeName) {
            var instance = this;
            var modelList = instance.propertyList.get('data');

            modelList.each(
                function(model) {
                    var editorName = model.get('editor').name;
                    if (attributeName === model.get('attributeName')) {
                        if (editorName === 'radioCellEditor' || editorName === 'dropDownCellEditor') {
                            instance.modalChoices(field, attributeName, model);
                        }
                        else if (editorName === 'form-builder-options-editor'){
                            instance.modalOptionsEditor(field, attributeName, model);
                        }
                        else {
                            instance.modalTextInput(field, attributeName, editorName);
                        }
                    }
                }
            );
        },

        keyboardUpdateProperties: function(field, attributeName, value) {
            var instance = this;
            var modelList = instance.propertyList.get('data');

            modelList.each(
                function(model) {
                    if (attributeName === model.get('attributeName')) {
                        if (attributeName === 'name') {
                            value = L.trim(value);
                            value = L.String.toLowerCase(value);
                            value = L.String.camelize(value, ' ');
                        }

                        if (attributeName === 'label') {
                            value = L.String.capitalize(value);
                        }

                        field.set(model.get('attributeName'), value);
                    }
                }
            );

            instance.simulateFocusField(field);
        },

        modalAvailableProperties: function(field) {
            var instance = this;
            var modelList = instance.propertyList.get('data');
            var content = A.Node.create('<div class="edit-properties-modal"></div>');
            var i = 1;

            modelList.each(
                function(model) {
                    var attributeName = model.get('attributeName');
                    var attributeLabel = '(' + i + ') ' +  model.get('name');
                    var button = A.Node.create('<button class="btn btn-primary btn-block modal-keyboard-button properties-button" value="' + attributeName + '">' + attributeLabel + '</button>');

                    if (!model.get('editor')) {
                        button.addClass('disabled');
                    }
                    else {
                        button.addClass('enabled');
                    }

                    content.appendChild(button);

                    i++;
                }
            );

            var editPropertiesModal = new A.Modal(
                {
                    bodyContent: content,
                    centered: true,
                    destroyOnHide: true,
                    headerContent: 'Please choose a property to edit',
                    render: '#newModal',
                    zIndex: 1001
                }
            ).render();

            A.all('.properties-button.enabled').on('click',
                function(event) {
                    var editProperty = event.target._node.value;

                    editPropertiesModal.hide();

                    instance.keyboardChooseProperty(field, editProperty);
                }
            );

            A.one('.properties-button.enabled').focus();
        },

        modalChoices: function(field, attributeName, model) {
            var instance = this;
            var content = A.Node.create('<div class="choices-modal"></div>');
            var options = model.get('editor').get('options');
            var i = 1;

            for (var key in options) {
                var label = '(' + i + ') ' + options[key];
                var value = key;

                var button = A.Node.create('<button class="btn btn-primary btn-block choices-button modal-keyboard-button" value="' + value + '">' + label + '</button>');

                if (button.get('value') === 'false') {
                    button.replaceClass('btn-primary', 'btn-danger');
                }

                content.appendChild(button);

                i++;
            }

            var modalChoices = new A.Modal(
                {
                    bodyContent: content,
                    centered: true,
                    destroyOnHide: true,
                    render: '#newModal',
                    zIndex: 1001
                }
            ).render();

            A.all('.choices-button').on('click',
                function(event) {
                    var value = event.target._node.value;

                    modalChoices.hide();

                    instance.keyboardUpdateProperties(field, attributeName, value);
                }
            );

            A.one('.choices-button').focus();
        },

        modalOptionsEditor: function(field, attributeName, model) {
            var instance = this;
            var content = A.Node.create('<div class="options-editor-modal"></div>');
            var form = A.Node.create('<form role="form" class="property-form"></form>');
            var options = model.get('editor').get('options');

            for (var key in options) {
                var label = options[key];
                var value = key;

                var optionWrapper = A.Node.create('<div class="form-group option-wrapper"></div>');

                var optionUp = A.Node.create('<button class="btn btn-default options-editor-button pull-left reorder up"><span class="glyphicon glyphicon-chevron-up"></span></button>');
                var optionDown = A.Node.create('<button class="btn btn-default options-editor-button pull-left reorder down"><span class="glyphicon glyphicon-chevron-down"></span></button>');

                var optionLabel = A.Node.create('<div class="col-xs-4"><input type="text" class="form-control option-input option-label" placeholder="Option Label" value="' + label + '"></div>');
                var optionValue = A.Node.create('<div class="col-xs-4"><input type="text" class="form-control option-input option-value" placeholder="Option Value" value="' + value + '"></div>');

                var addOptionButton = A.Node.create('<button class="btn btn-success options-editor-button add"><span class="glyphicon glyphicon-plus"></span></button>');
                var deleteButton = A.Node.create('<button class="btn btn-danger options-editor-button delete"><span class="glyphicon glyphicon-remove"></span></button>');

                optionWrapper.appendChild(optionUp);
                optionWrapper.appendChild(optionDown);
                optionWrapper.appendChild(optionLabel);
                optionWrapper.appendChild(optionValue);
                optionWrapper.appendChild(addOptionButton);
                optionWrapper.appendChild(deleteButton);

                form.appendChild(optionWrapper);
            }

            var saveOptionsButton = A.Node.create('<button class="btn btn-primary btn-block options-editor-button save">Save Options</button>');

            content.appendChild(form);
            content.appendChild(saveOptionsButton);


            var modalOptionsEditor = new A.Modal(
                {
                    bodyContent: content,
                    centered: true,
                    destroyOnHide: true,
                    id: 'options-editor',
                    render: '#newModal',
                    zIndex: 1001
                }
            ).render();

            content.delegate('click', instance.reorderOptions, '.options-editor-button.reorder');

            content.delegate('click', instance.modalOptionsEditorDeleteOption, '.options-editor-button.delete');

            content.delegate('click', instance.modalOptionsEditorAddOption, '.options-editor-button.add');

            content.delegate('click', instance.getOptionsValues, '.options-editor-button.save', instance, field, attributeName, modalOptionsEditor);

            A.one('.form-control').focus();
        },

        reorderOptions: function(event) {
            var instance = this;
            var target = event.target;
            var group = target.ancestor('.option-wrapper');
            var swapNode;


            if (target.hasClass('up')) {
                swapNode = group.previous();

                if (swapNode !== null) {
                    group.remove();
                    swapNode.placeBefore(group);
                }
            }
            else if (target.hasClass('down')) {
                swapNode = group.next();

                if (swapNode !== null) {
                    group.remove();
                    swapNode.placeAfter(group);
                }
            }

            target.focus();

            event.halt();
        },

        getOptionsValues: function(event, field, attributeName, widget) {
            var instance = this;
            var optionLabels = A.all('.option-label')._nodes;
            var optionValues = A.all('.option-value')._nodes;
            var valueArray = [];
            var valueObject = {};

            event.halt();

            for (var i = 0; i < optionValues.length; i++) {
                var option = {};
                var label = optionLabels[i].value;

                value = optionValues[i].value;

                option.label = label;
                option.value = value;

                valueObject[value] = label;

                valueArray.push(option);
            }

            widget.hide();

            field.predefinedValueEditor.set('options', valueObject);

            instance.keyboardUpdateProperties(field, attributeName, valueArray);
        },

        modalOptionsEditorAddOption: function(event) {
            var instance = this;
            var group = event.target.ancestor('.option-wrapper');
            var form = A.one('.property-form');

            event.halt();

            var optionWrapper = A.Node.create('<div class="form-group option-wrapper"></div>');

            var optionUp = A.Node.create('<button class="btn btn-default options-editor-button pull-left reorder up"><span class="glyphicon glyphicon-chevron-up"></span></button>');
            var optionDown = A.Node.create('<button class="btn btn-default options-editor-button pull-left reorder down"><span class="glyphicon glyphicon-chevron-down"></span></button>');

            var optionLabel = A.Node.create('<div class="col-xs-4"><input type="text" class="form-control option-input option-label" placeholder="Option Label"></div>');
            var optionValue = A.Node.create('<div class="col-xs-4"><input type="text" class="form-control option-input option-value" placeholder="Option Value"></div>');

            var addOptionButton = A.Node.create('<button class="btn btn-success options-editor-button add"><span class="glyphicon glyphicon-plus"></span></button>');
            var deleteButton = A.Node.create('<button class="btn btn-danger options-editor-button delete"><span class="glyphicon glyphicon-remove"></span></button>');

            optionWrapper.appendChild(optionUp);
            optionWrapper.appendChild(optionDown);
            optionWrapper.appendChild(optionLabel);
            optionWrapper.appendChild(optionValue);
            optionWrapper.appendChild(addOptionButton);
            optionWrapper.appendChild(deleteButton);

            group.placeAfter(optionWrapper);

            optionWrapper.delegate('click', instance.reorderOptions, '.options-editor-button.reorder');

            optionWrapper.delegate('click', instance.modalOptionsEditorDeleteOption, '.options-editor-button.delete');

            optionWrapper.delegate('click', instance.modalOptionsEditorAddOption, '.options-editor-button.add');

            optionWrapper.one('.option-input').focus();
        },

        modalOptionsEditorDeleteOption: function(event) {
            var deleteTarget = event.target.ancestor('.option-wrapper');

            event.halt();

            if (deleteTarget.next() !== null) {
                deleteTarget.next().one('.form-control').focus();
            }
            else if (deleteTarget.previous() !== null) {
                deleteTarget.previous().one('.form-control').focus();
            }

            deleteTarget.remove(true);
        },

        modalTextInput: function(field, attributeName, editorName) {
            var instance = this;
            var content = A.Node.create('<div class="input-modal"></div>');
            var propertyForm = A.Node.create('<form role="form" class="property-form"></form>');

            if (editorName === 'textAreaCellEditor') {
                var textInput = A.Node.create('<textarea class="form-control property-input"></textarea>');
            }
            else {
                var textInput = A.Node.create('<input type="text" class="form-control property-input" id="propertyText" placeholder="Enter new property">');
            }

            propertyForm.appendChild(textInput);

            content.appendChild(propertyForm);

            var modalTextInput = new A.Modal(
                {
                    bodyContent: content,
                    centered: true,
                    destroyOnHide: true,
                    render: '#newModal',
                    zIndex: 1001
                }
            ).render();

            A.one('.property-form').on('submit',
                function(event) {
                    event.halt();

                    var value = A.one('#propertyText').get('value');

                    modalTextInput.hide();

                    instance.keyboardUpdateProperties(field, attributeName, value);
                }
            );

            A.one('#propertyText').focus();
        },

        modalAvailableFields: function(targetNode, parent, addChild) {
            var instance = this;
            var uniqueField = false;

            var currentFields = instance.get('fields')._items;

            var verifyUnique = function(element) {
                if (element.get('unique')) {
                    uniqueField = true;
                }
            }

            currentFields.forEach(verifyUnique);

            var availableFields = instance.get('availableFields');

            var content = A.Node.create('<div class="add-new-field-modal"></div>');

            for (var i = 0; i < availableFields.length; i++) {
                var label = availableFields[i].get('label');
                var uniqueAvailableField = availableFields[i].get('unique');
                var button = A.Node.create('<button class="btn btn-primary btn-block available-field-button modal-keyboard-button" value="' + i + '">(' + (i + 1) + ') ' + label + '</button>');

                console.log('uniqueField: ', uniqueField);

                console.log('uniqueAvailableField: ', uniqueAvailableField);

                if (uniqueAvailableField && uniqueField) {
                    button.addClass('disabled');
                }
                else {
                    button.addClass('enabled');
                }

                content.appendChild(button);
            }

            var newFieldModal = new A.Modal(
                {
                    bodyContent: content,
                    centered: true,
                    destroyOnHide: true,
                    render: '#newModal',
                    zIndex: 1001
                }
            ).render();

            A.all('.available-field-button.enabled').on('click',
                function(event) {
                    var index = event.target._node.value;

                    newFieldModal.hide();

                    instance.keyboardNewField(targetNode, parent, addChild, index);
                }
            );

            A.one('.available-field-button.enabled').focus();
        },

        keyboardNewField: function(targetNode, parent, addChild, index) {
            var instance = this;

            var availableFields = instance.get('availableFields');
            var availableField = availableFields[index];

            if (!isNaN(index)) {
                var config = {
                    hiddenAttributes: availableField.get('hiddenAttributes'),
                    label: availableField.get('label'),
                    localizationMap: availableField.get('localizationMap'),
                    options: availableField.get('options'),
                    predefinedValue: availableField.get('predefinedValue'),
                    readOnlyAttributes: availableField.get('readOnlyAttributes'),
                    required: availableField.get('required'),
                    showLabel: availableField.get('showLabel'),
                    tip: availableField.get('tip'),
                    type: availableField.get('type'),
                    unique: availableField.get('unique'),
                    width: availableField.get('width')
                }

                if (config.unique) {
                    config.id = instance._getFieldId(availableField);
                    config.name = availableField.get('name');
                }

                var i = instance._getFieldNodeIndex(targetNode) + 1;

                var newField = instance.createField(config);

                instance.insertField(newField, i, parent);

                if (addChild) {
                    targetNode.one('.form-builder-field').focus();
                }
                else if (targetNode.next()){
                    targetNode.next().focus();
                }
                else {
                    A.one('.form-builder-field').focus();
                }
            }
        },

        /**
         * Enables the settings tab.
         *
         * @method openEditProperties
         * @param field
         */
        openEditProperties: function(field) {
            var instance = this;

            instance.tabView.enableTab(A.FormBuilder.SETTINGS_TAB);
            instance.tabView.selectChild(A.FormBuilder.SETTINGS_TAB);
            instance.propertyList.set('data', instance.getFieldProperties(field, true));
        },

        /**
         * Renders a field in the container.
         *
         * @method plotField
         * @param field
         * @param container
         */
        plotField: function(field, container) {
            var instance = this,
                boundingBox = field.get('boundingBox');

            if (!field.get('rendered')) {
                field.render(container);
            }
            else {
                container.append(boundingBox);
            }

            instance._syncUniqueField(field);

            instance.fieldsSortableList.add(boundingBox);
        },

        /**
         * Renders a list of fields in the container.
         *
         * @method plotFields
         * @param fields
         * @param container
         */
        plotFields: function(fields, container) {
            var instance = this;

            container = container || instance.dropContainer;
            fields = fields || instance.get('fields');

            container.setContent('');

            A.each(fields, function(field) {
                instance.plotField(field, container);
            });
        },

        /**
         * Adds fields to a `A.LinkedSet` instance.
         *
         * @method selectFields
         * @param fields
         */
        selectFields: function(fields) {
            var instance = this,
                selectedFieldsLinkedSet = instance.selectedFieldsLinkedSet;

            aArray.each(aArray(fields), function(field) {
                selectedFieldsLinkedSet.add(field);
            });
        },

        /**
         * Triggers a focus event in the current field and a blur event in the
         * last focused field.
         *
         * @method simulateFocusField
         * @param field
         */
        simulateFocusField: function(field) {
            var instance = this,
                lastFocusedField = instance.lastFocusedField;

            if (lastFocusedField) {
                lastFocusedField.blur();
            }

            instance.lastFocusedField = field.focus();
        },

        /**
         * Removes fields from the `A.LinkedSet` instance.
         *
         * @method unselectFields
         * @param fields
         */
        unselectFields: function(fields) {
            var instance = this,
                selectedFieldsLinkedSet = instance.selectedFieldsLinkedSet;

            if (!fields) {
                fields = selectedFieldsLinkedSet.values();
            }

            aArray.each(aArray(fields), function(field) {
                selectedFieldsLinkedSet.remove(field);
            });
        },

        /**
         * Triggers after field focused change.
         *
         * @method _afterFieldFocusedChange
         * @param event
         * @protected
         */
        _afterFieldFocusedChange: function(event) {
            var instance = this,
                field = event.target;

            if (event.newVal && isFormBuilderField(field)) {
                instance.editField(field);
            }
        },

        /**
         * Triggers after adding unique fields to a `A.Map` instance.
         *
         * @method _afterUniqueFieldsMapPut
         * @param event
         * @protected
         */
        _afterUniqueFieldsMapPut: function(event) {
            var availableField = getAvailableFieldById(event.key),
                node;

            if (isAvailableField(availableField)) {
                node = availableField.get('node');

                availableField.set('draggable', false);
                node.unselectable();
            }
        },

        /**
         * Triggers after removing unique fields from the `A.Map` instance.
         *
         * @method _afterUniqueFieldsMapRemove
         * @param event
         * @protected
         */
        _afterUniqueFieldsMapRemove: function(event) {
            var availableField = getAvailableFieldById(event.key),
                node;

            if (isAvailableField(availableField)) {
                node = availableField.get('node');

                availableField.set('draggable', true);
                node.selectable();
            }
        },

        /**
         * Triggers after adding selected fields to a `A.LinkedSet` instance.
         *
         * @method _afterSelectedFieldsSetAdd
         * @param event
         * @protected
         */
        _afterSelectedFieldsSetAdd: function(event) {
            var instance = this;

            event.value.set('selected', true);

            instance.openEditProperties(event.value);
        },

        /**
         * Triggers after removing selected fields from the `A.LinkedSet`
         * instance.
         *
         * @method _afterSelectedFieldsSetRemove
         * @param event
         * @protected
         */
        _afterSelectedFieldsSetRemove: function(event) {
            var instance = this;

            event.value.set('selected', false);

            instance.closeEditProperties();
        },

        /**
         * Triggers after removing selected fields from the `A.LinkedSet`
         * instance.
         *
         * @method _afterSelectedFieldsSetRemove
         * @param event
         * @protected
         */
        _bindKeypress: function() {
            var instance = this;

            instance._keyHandler = A.one('doc').on('keydown', A.bind(instance._handleKeypressEvent, instance));
        },

        /**
         * Clones a field.
         *
         * @method _cloneField
         * @param field
         * @param deep
         * @protected
         * @return {Object}
         */
        _cloneField: function(field, deep) {
            var instance = this,
                config = field.getAttributesForCloning();

            if (deep) {
                config.fields = [];

                A.each(field.get('fields'), function(child, index) {
                    if (!child.get('unique')) {
                        config.fields[index] = instance._cloneField(child, deep);
                    }
                });
            }

            return instance.createField(config);
        },

        /**
         * Executes when the field is dropped.
         *
         * @method _dropField
         * @param dragNode
         * @protected
         */
        _dropField: function(dragNode) {
            var instance = this,
                availableField = dragNode.getData('availableField'),
                field = A.Widget.getByNode(dragNode);

            if (isAvailableField(availableField)) {
                var config = {
                    hiddenAttributes: availableField.get('hiddenAttributes'),
                    label: availableField.get('label'),
                    localizationMap: availableField.get('localizationMap'),
                    options: availableField.get('options'),
                    predefinedValue: availableField.get('predefinedValue'),
                    readOnlyAttributes: availableField.get('readOnlyAttributes'),
                    required: availableField.get('required'),
                    showLabel: availableField.get('showLabel'),
                    tip: availableField.get('tip'),
                    type: availableField.get('type'),
                    unique: availableField.get('unique'),
                    width: availableField.get('width')
                };

                if (config.unique) {
                    config.id = instance._getFieldId(availableField);
                    config.name = availableField.get('name');
                }

                field = instance.createField(config);
            }

            if (isFormBuilderField(field)) {
                var parentNode = dragNode.get('parentNode'),
                    dropField = A.Widget.getByNode(parentNode),
                    index = instance._getFieldNodeIndex(dragNode);

                if (!isFormBuilderField(dropField)) {
                    dropField = instance;
                }

                instance.insertField(field, index, dropField);
            }
        },

        /**
         * Gets the field id.
         *
         * @method _getFieldId
         * @param field
         * @protected
         * @return {String}
         */
        _getFieldId: function(field) {
            var id = field.get('id'),
                prefix;

            if (isAvailableField(field)) {
                prefix = AVAILABLE_FIELDS_ID_PREFIX;
            }
            else {
                prefix = FIELDS_ID_PREFIX;
            }

            return id.replace(prefix, '');
        },

        /**
         * Gets the index from the field node.
         *
         * @method _getFieldNodeIndex
         * @param fieldNode
         * @protected
         */
        _getFieldNodeIndex: function(fieldNode) {
            return fieldNode.get('parentNode').all(
                // prevent the placeholder interference on the index
                // calculation
                '> *:not(' + '.' + CSS_FORM_BUILDER_PLACEHOLDER + ')'
            ).indexOf(fieldNode);
        },

        /**
         * Gets the index from the field node.
         *
         * @method _getFieldNodeIndex
         * @param fieldNode
         * @protected
         */
        _handleKeypressEvent: function(event) {
            var instance = this,
                targetNode = event.target,
                field = A.Widget.getByNode(targetNode),
                ancestor,
                buttonClass,
                childField,
                i,
                parentField,
                next = targetNode.next(),
                previous = targetNode.previous(),
                keyCode = event.keyCode,
                keyCtrl = event.ctrlKey,
                keyShift = event.shiftKey;


            if (!targetNode.hasClass('form-control')) {
                if(keyShift && keyCode === 191) {
                    A.io.request(
                        'help.html',
                        {
                            dataType: 'html',
                            on: {
                                success: function() {
                                    var data = this.get('responseData');
                                    var modal = new A.Modal(
                                        {
                                            bodyContent: data,
                                            centered: true,
                                            headerContent: 'Help',
                                            render: '#modal',
                                            zIndex: 1003
                                        }
                                    ).render();
                                }
                            }
                        }
                    );
                }
            }

            if (targetNode.hasClass('form-builder-field-node')) {
                ancestor = targetNode.ancestor('.form-builder-field');

                if ((keyCode === keyEscape) || // Escape Key to exit editing
                    (keyCode === keyEnter && !targetNode.hasClass('field-textarea')) || // Enter Key to insert newline in text area
                    (targetNode.hasClass('field-textarea') && keyCode === keyEnter && keyCtrl === true)) { // CTRL-Enter to exit text area editing

                    ancestor.focus(); // Returns focus to field

                    event.halt();
                }
            }

            else if (targetNode.hasClass('form-builder-field')) {
                ancestor = targetNode.ancestor('.form-builder-field');
                childField = targetNode.one('.form-builder-field');
                // Lower Case "j" or CTRL-Down Arrow
                if ((keyCode === keyLowerJ || (keyCtrl === true && keyCode === keyDownArrow )) && next !== null) {
                    if (ancestor !== null) {
                        parentField = A.Widget.getByNode(ancestor);
                    }
                    else {
                        parentField = instance;
                    }

                    i = instance._getFieldNodeIndex(next);

                    instance.insertField(field, i, parentField);

                    targetNode.focus();

                    event.halt();

                }

                // Lower Case "k" or CTRL-Up Arrow
                else if ((keyCode === keyLowerK || (keyCtrl === true && keyCode === keyUpArrow)) && previous !== null) {
                    if (ancestor !== null) {
                        parentField = A.Widget.getByNode(ancestor);
                    }
                    else {
                        parentField = instance;
                    }

                    i = instance._getFieldNodeIndex(previous);

                    instance.insertField(field, i, parentField);

                    targetNode.focus();

                    event.halt();
                }

                // Right Arrow
                else if (keyCode === keyRightArrow) {
                    if (childField !== null) {
                        childField.focus(); // Enters sub-fields of a field-set
                    }
                    else if (next !== null) {
                        next.focus(); // Focuses next field
                    }

                    event.halt();
                }

                // Down Arrow
                else if (keyCode === keyDownArrow && next !== null) {
                    next.focus(); // Focuses next field

                    event.halt();
                }

                // Left Arrow
                else if (keyCode === keyLeftArrow) {
                    if (ancestor !== null) {
                        ancestor.focus(); // Selects Parent Field
                    }

                    else if (previous !== null) {
                        previous.focus(); // Focuses previous field
                    }

                    event.halt();
                }

                // Up Arrow
                else if (keyCode === keyUpArrow && previous !== null) {
                    previous.focus(); // Focuses previous field

                    event.halt();
                }

                // Enter Key
                else if (keyCode === keyEnter) {
                    if (targetNode.one('> .form-builder-field-content > .form-builder-field-wrapper > .form-builder-field-node') || targetNode.one('> .form-builder-field-content > .form-builder-field-node')) {
                            targetNode.one('.form-builder-field-node').focus(); // Puts focus on the input field
                    }
                    else if (childField !== null) {
                        childField.focus(); // Enters sub-fields of a field-set
                    }

                    event.halt();
                }

                // Escape Key
                else if (keyCode === keyEscape && ancestor) {
                    ancestor.focus(); // Selects Parent Field

                    event.halt();
                }

                // Delete or Backspace Key
                else if (keyCode === keyDelete || keyCode === keyBackspace) {
                    var destroyField = field;

                    var confirmDelete = confirm('Are you sure you want to delete the selected field?');

                    if (confirmDelete) {
                        destroyField.destroy(); // Deletes selected field
                    }

                    if (next !== null) {
                        next.focus();
                    }
                    else if (previous !== null) {
                        previous.focus();
                    }

                    else if (ancestor !== null) {
                        ancestor.focus();
                    }

                    event.halt();
                }

                // Lower Case "d"
                else if (keyCode === keyLowerD) {
                    var unique = field.get('unique');

                    if (!unique) {
                        instance.duplicateField(field); // Duplicates selected field
                    }
                    else {
                        alert('Field is unique');
                    }

                    targetNode.focus();

                    event.halt();
                }

                // Lower Case "e"
                else if (keyCode === keyLowerE) {
                    instance.modalAvailableProperties(field);

                    event.halt();
                }

                // Lower Case "n"
                else if (keyCode === keyLowerN) {
                    if (ancestor !== null) {
                        parentField = A.Widget.getByNode(ancestor);
                    }
                    else {
                        parentField = instance;
                    }

                    instance.modalAvailableFields(targetNode, parentField, false);

                    event.halt();
                }

                // Lower Case "c"
                else if (keyCode === keyLowerC) {
                    parentField = field;

                    if (field.get('acceptChildren')) {
                        instance.modalAvailableFields(targetNode, parentField, true);
                    }

                    else {
                        alert('This field does not accept children');
                    }

                    event.halt();
                }
            }

            else if (targetNode.hasClass('modal-keyboard-button')) {
                // Down Arrow
                if (keyCode === keyDownArrow && next !== null) {

                    next.radioClass('focused');
                    next.focus(); // Focuses next field

                    event.halt();
                }

                // Up Arrow
                else if (keyCode === keyUpArrow && previous !== null) {
                    previous.radioClass('focused');
                    previous.focus(); // Focuses previous field

                    event.halt();
                }

                else if (keyCode === keyEscape) {
                    A.one('.form-builder-field-selected').focus();
                }

                else if (keyNumberKeys[keyCode] !== undefined) {
                    var buttons = A.all('.modal-keyboard-button').get('nodes');
                    var index = keyNumberKeys[keyCode] - 1;
                    var button = buttons[index];

                    if (button && button.hasClass('focused')) {
                        button.simulate('click');
                    }
                    else if (button) {
                        button.focus();
                        button.radioClass('focused');
                    }

                    buttons = null;

                    event.halt();
                }
            }

            else if (targetNode.hasClass('options-editor-button')) {
                var optionWrapper = targetNode.ancestor('.option-wrapper');


                if (targetNode.hasClass('add')) {
                    buttonClass = '.add';
                }

                if (targetNode.hasClass('delete')) {
                    buttonClass = '.delete';
                }

                if (targetNode.hasClass('down')) {
                    buttonClass = '.down';
                }

                if (targetNode.hasClass('up')) {
                    buttonClass = '.up';
                }


                if (keyCode === keyRightArrow) {
                    if (next !== null) {
                        next.focus();
                    }
                }

                if (keyCode === keyLeftArrow) {
                    if (previous !== null) {
                        previous.focus();
                    }
                }

                if (keyCode === keyDownArrow) {
                    if (optionWrapper.next() !== null) {
                        optionWrapper.next().one(buttonClass).focus();
                    }
                    else {
                        A.one('.options-editor-button.save').focus();
                    }
                }

                if (keyCode === keyUpArrow) {
                    if (optionWrapper.previous() !== null) {
                        optionWrapper.previous().one(buttonClass).focus();
                    }
                }
            }

            else if (targetNode.hasClass('option-input')) {
                ancestor = targetNode.ancestor('.option-wrapper');

                if (targetNode.hasClass('option-label')) {
                    buttonClass = '.option-label';
                }

                if (targetNode.hasClass('option-value')) {
                    buttonClass = '.option-value';
                }

                if (keyCode === keyEnter) {
                    if (targetNode.next() === null && ancestor.next() !== null) {
                        ancestor.next().one(buttonClass).focus();
                    }
                    event.halt();
                }

                if (keyCode === keyDownArrow) {
                    if (ancestor.next() !== null) {
                        ancestor.next().one(buttonClass).focus();
                    }
                    else {
                        A.one('.options-editor-button.save').focus();
                    }
                }

                if (keyCode === keyUpArrow) {
                    if (ancestor.previous() !== null) {
                        ancestor.previous().one(buttonClass).focus();
                    }
                }
            }

            else if (!targetNode.hasClass('form-control')) {
                if (keyCode === keyLowerF) {
                    if (instance.lastFocusedField) {
                        A.one('.form-builder-field-selected').focus();
                    }
                    else if (A.one('.form-builder-field')) {
                        A.one('.form-builder-field').focus();
                    }

                    event.halt();
                }

                if (keyCode === keyLowerN) {
                    target = A.one('.diagram-builder-drop-container');

                    instance.modalAvailableFields(target, instance, false);

                    event.halt();
                }
            }
        },

        /**
         * Triggers on cancel. Unselect fields, stops the event propagation and
         * prevents the default event behavior.
         *
         * @method _onCancel
         * @param event
         * @protected
         */
        _onCancel: function(event) {
            var instance = this;

            instance.unselectFields();

            event.halt();
        },

        /**
         * Triggers when the drag ends.
         *
         * @method _onDragEnd
         * @param event
         * @protected
         */
        _onDragEnd: function(event) {
            var instance = this,
                drag = event.target,
                dragNode = drag.get('node');

            instance._dropField(dragNode);

            // skip already instanciated fields
            if (!isFormBuilderField(A.Widget.getByNode(dragNode))) {
                dragNode.remove();

                drag.set('node', instance._originalDragNode);
            }
        },

        /**
         * Triggers when a field is clicked.
         *
         * @method _onClickField
         * @param event
         * @protected
         */
        _onClickField: function(event) {
            var instance = this,
                field = A.Widget.getByNode(event.target);

            instance.simulateFocusField(field);

            event.stopPropagation();
        },

        /**
         * Triggers when the drag mouse down.
         *
         * @method _onDragMouseDown
         * @param event
         * @protected
         */
        _onDragMouseDown: function(event) {
            var dragNode = event.target.get('node'),
                availableField = A.AvailableField.getAvailableFieldByNode(dragNode);

            if (isAvailableField(availableField) && !availableField.get('draggable')) {
                event.halt();
            }
        },

        /**
         * Triggers when the drag starts.
         *
         * @method _onDragStart
         * @param event
         * @protected
         */
        _onDragStart: function(event) {
            var instance = this,
                drag = event.target,
                dragNode = drag.get('node');

            // skip already instanciated fields
            if (isFormBuilderField(A.Widget.getByNode(dragNode))) {
                return;
            }

            // in the dragEnd we`re going to restore the drag node
            // to the original node
            instance._originalDragNode = dragNode;

            var clonedDragNode = dragNode.clone();
            dragNode.placeBefore(clonedDragNode);

            drag.set('node', clonedDragNode);

            var availableFieldData = dragNode.getData('availableField');
            clonedDragNode.setData('availableField', availableFieldData);

            clonedDragNode.attr('id', '');
            clonedDragNode.hide();

            dragNode.removeClass(CSS_DD_DRAGGING);
            dragNode.show();

            instance.fieldsSortableList.add(clonedDragNode);
        },

        /**
         * Triggers when the mouse is out a field.
         *
         * @method _onMouseOutField
         * @param event
         * @protected
         */
        _onMouseOutField: function(event) {
            var field = A.Widget.getByNode(event.currentTarget);

            field.controlsToolbar.hide();
            field.get('boundingBox').removeClass(CSS_FIELD_HOVER);

            event.stopPropagation();
        },

        /**
         * Triggers when the mouse is over a field.
         *
         * @method _onMouseOverField
         * @param event
         * @protected
         */
        _onMouseOverField: function(event) {
            var field = A.Widget.getByNode(event.currentTarget);

            field.controlsToolbar.show();
            field.get('boundingBox').addClass(CSS_FIELD_HOVER);

            event.stopPropagation();
        },

        /**
         * Triggers on saving a field. First checks if the field is being
         * edited, if it is then sets the data and syncs on the UI.
         *
         * @method _onSave
         * @param event
         * @protected
         */
        _onSave: function() {
            var instance = this,
                editingField = instance.editingField;

            if (editingField) {
                var modelList = instance.propertyList.get('data');

                modelList.each(function(model) {
                    editingField.set(model.get('attributeName'), model.get('value'));
                });

                instance._syncUniqueField(editingField);
            }
        },

        /**
         * Set list of available fields by checking if a field is a
         * `A.AvailableField` instance. If not creates a new instance of
         * `A.FormBuilderAvailableField`.
         *
         * @method _setAvailableFields
         * @param val
         * @protected
         * @return {Array}
         */
        _setAvailableFields: function(val) {
            var fields = [];

            aArray.each(val, function(field) {
                fields.push(
                    isAvailableField(field) ? field : new A.FormBuilderAvailableField(field)
                );
            });

            return fields;
        },

        /**
         * Set the `fieldsSortableListConfig` attribute.
         *
         * @method _setFieldsSortableListConfig
         * @param val
         * @protected
         */
        _setFieldsSortableListConfig: function(val) {
            var instance = this,
                dropContainer = instance.dropContainer;

            return A.merge({
                    bubbleTargets: instance,
                    dd: {
                        groups: ['availableFields'],
                        plugins: [
                            {
                                cfg: {
                                    horizontal: false,
                                    scrollDelay: 150
                                },
                                fn: A.Plugin.DDWinScroll
                            }
                        ]
                    },
                    dropCondition: function(event) {
                        var dropNode = event.drop.get('node'),
                            field = A.Widget.getByNode(dropNode);

                        if (isFormBuilderField(field)) {
                            return true;
                        }

                        return false;
                    },
                    placeholder: A.Node.create(TPL_PLACEHOLDER),
                    dropOn: '.' + CSS_FORM_BUILDER_DROP_ZONE,
                    sortCondition: function(event) {
                        var dropNode = event.drop.get('node');

                        return (dropNode !== instance.dropContainer &&
                            dropContainer.contains(dropNode));
                    }
                },
                val || {}
            );
        },

        /**
         * Setup a `A.SortableList` of available fields.
         *
         * @method _setupAvailableFieldsSortableList
         * @protected
         */
        _setupAvailableFieldsSortableList: function() {
            var instance = this;

            if (!instance.availableFieldsSortableList) {
                var availableFieldsNodes = instance.fieldsContainer.all(
                    '.' + CSS_DIAGRAM_BUILDER_FIELD_DRAGGABLE
                );

                instance.availableFieldsSortableList = new A.SortableList(
                    A.merge(
                        instance.get('fieldsSortableListConfig'), {
                            nodes: availableFieldsNodes
                        }
                    )
                );
            }
        },

        /**
         * Setup a `A.SortableList` of fields.
         *
         * @method _setupFieldsSortableList
         * @protected
         */
        _setupFieldsSortableList: function() {
            var instance = this;

            if (!instance.fieldsSortableList) {
                instance.fieldsSortableList = new A.SortableList(
                    instance.get('fieldsSortableListConfig')
                );
            }
        },

        /**
         * Sync unique fields.
         *
         * @method _syncUniqueField
         * @param field
         * @protected
         */
        _syncUniqueField: function(field) {
            var instance = this,
                fieldId = instance._getFieldId(field),
                availableField = getAvailableFieldById(fieldId);

            if (isAvailableField(availableField)) {
                if (availableField.get('unique') || field.get('unique')) {
                    instance.uniqueFieldsMap.put(fieldId, field);
                }
            }
        },

        /**
         * Set the `allowRemoveRequiredFields` attribute on the UI.
         *
         * @method _uiSetAllowRemoveRequiredFields
         * @param val
         * @protected
         */
        _uiSetAllowRemoveRequiredFields: function() {
            var instance = this;

            instance.get('fields').each(function(field) {
                field._uiSetRequired(field.get('required'));
            });
        }
    }

});

A.FormBuilder = FormBuilder;

A.FormBuilder.types = {};