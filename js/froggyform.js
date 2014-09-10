var FroggyForm = function(_container) {
  jQuery.event.props.push('dataTransfer');
  
  var container = _container;
  var formData = [];
  
  this.getFormData = function() {
    return formData;
  }
  
  this.moveFormData = function(from, to) {
    var tempData = [];
    
    if (from > to) {
      for (var i=0; i<=to-1; i++) {
        tempData.push(formData[i]);
      }
      
      tempData.push(formData[from]);
      
      for (var i=to; i<formData.length; i++) {
        if (i != from) {
          tempData.push(formData[i]);
        }
      }
    }
    else {
      for (var i=0; i<= to; i++) {
        if (i != from) {
          tempData.push(formData[i]);
        }
      }
      
      tempData.push(formData[from]);
      
      for (var i=to+1; i<formData.length; i++) {
        tempData.push(formData[i]);
      }
    }
    
    formData = tempData;
  }
  
  this.getContainer = function() {
    return container;
  }
  
  this.loadData = function(existingData) {
    for (var i=0; i<existingData.length; i++) {
      var data = existingData[i];
      
      var question = this.addQuestion(data);
      container.append(question.getView());
      question.getFormBlock().doneAction();
    }
  }
}

FroggyForm.prototype.makeDraggable = function(element) {
  var froggyFormRef = this;
  froggyFormRef.dragSrcEl = null;
  
  function handleDragStart(e) {
    this.style.opacity = "0.4";
    
    froggyFormRef.dragSrcEl = $(this);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  
  function handleDragOver(e) {
    e.preventDefault()
    
    e.dataTransfer.dropEffect = 'move';
    
    return false;
  }
  
  function handleDragEnter(e) {
    this.classList.add("over");  
  }
  
  function handleDragLeave(e) {
    this.classList.remove("over");
  }
  
  function handleDrop(e) {
    //console.log("drop", froggyFormRef.dragSrcEl, $(this));
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (froggyFormRef.dragSrcEl[0] != $(this)[0]) {

      var srcIndex = froggyFormRef.dragSrcEl.prevAll().length;
      var destIndex = $(this).prevAll().length;
      
      //console.log(srcIndex, destIndex);
      if (srcIndex < destIndex) {
        //console.log(1);
        $(this).after(froggyFormRef.dragSrcEl);
      } else {
        //console.log(2);
        $(this).before(froggyFormRef.dragSrcEl);
      }
      
      //console.log("FROM ", srcIndex, " TO ", destIndex);
      froggyFormRef.moveFormData(srcIndex, destIndex);
    }

  
    return false;
  }
  
  function handleDragEnd(e) {
    //console.log("drag end", e);
    this.style.opacity = "1";
  
    froggyFormRef.getContainer().children("div").each(function(index) {
      
      var box = froggyFormRef.getContainer().children("div").get(index);
      
      $(box).removeClass('over');
    });
  }
  
  
  element.attr("draggable", true);
          
  element.bind("dragstart", handleDragStart);
  element.on("dragenter", handleDragEnter);
  element.on("dragover", handleDragOver);
  element.on("dragleave", handleDragLeave);
  
  element.on("drop", handleDrop);
  element.on("dragend", handleDragEnd);
}

FroggyForm.prototype.addQuestion = function(options) {
  var that = this;
  
  var formBlock = {};
  formBlock.question = options.question || "";
  formBlock.formType = options.formType || "text";
  formBlock.options = [];
  formBlock.existingOptions = options.options || [];
  formBlock.scale = options.scale || null;
  
  this.getFormData().push(formBlock);
  
  var block = $("<li>")
                .addClass("panel")
                .addClass("panel-default")
                .addClass("panel-body");
                
  var inputBlock = $("<div>")
                .addClass("panel-body");
                
  var optionsBlock = $("<div>")
                .addClass("panel-body");
                
  var txtQuestion = $("<input>")
              .attr("type", "text")
              .addClass("form-control")
              .attr("placeholder", "Please write your question here.");
  txtQuestion.val(formBlock.question);
              
  var btnDone = $("<button>").attr("type", "button").addClass("btn").html("Done");
  
  var btnRemoveBlock = $("<button>").attr("type", "button").addClass("btn").html("Remove");
  var divRemove = $("<div>").attr("align", "right");
  
  btnRemoveBlock.click(function() {
    var index = that.getFormData().indexOf(formBlock);
    
    that.getFormData().splice(index, 1);
    
    block.remove();
  });
  
  divRemove.append(btnRemoveBlock);
  
  block.append(divRemove);
  inputBlock.append(txtQuestion);
  inputBlock.append(optionsBlock);
  block.append(inputBlock);
  
  var option;
  if (formBlock.formType == "text") {
    option = new TextboxOption();
  } else if (formBlock.formType == "paragraph") {
    option = new TextareaOption();
  } else if (formBlock.formType == "checkboxes") {
    option = new CheckboxOption(formBlock);
  } else if (formBlock.formType == "multiplechoice") {
    option = new RadioOption(formBlock);
  } else if (formBlock.formType == "choosefromalist") {
    option = new ComboOption(formBlock);
  } else if (formBlock.formType == "scale") {
    option = new ScaleOption(formBlock);
  }
  
  optionsBlock.append(option.getView());
  
  var divDone = $("<div>").attr("align", "right");
  divDone.append(btnDone);
  
  inputBlock.append(divDone);
  
  txtQuestion.change(function() {
    var value = txtQuestion.val();
    
    formBlock.question = value;
  });
  
  
  ///////////////////////////////////////////////////////////////////////////
  
  var previewBlock = $("<div>").addClass("previewBlock");
  
  var previewQuestion = $("<div>").addClass("previewQuestion").html(formBlock.question);
  
  var previewOptions = option.getOptionPreview();
  
  previewBlock.append(previewQuestion);
  previewBlock.append(previewOptions);
  
  txtQuestion.change(function() {
    previewQuestion.html(txtQuestion.val());
  });
  
  formBlock.doneAction = function() {
    previewOptions.remove();
    
    previewOptions = option.getOptionPreview();
    previewBlock.append(previewOptions);
    
    inputBlock.hide();
    previewBlock.show();
  };
  
  btnDone.click(formBlock.doneAction);
  
  // hide preview initially
  previewBlock.hide();
  
  previewBlock.dblclick(function() {
    previewBlock.hide();
    inputBlock.show();
  });
  
  block.append(previewBlock);
  
  /////////////////////////////////////////////////////////////////////////////////
  
  
  this.getView = function() {
    return block;
  }
  
  this.getFormBlock = function() {
    return formBlock;
  }
  
  delete formBlock.existingOptions;
  
  this.makeDraggable(block);
  
  return this;
}

function TextboxOption() {
  var optDiv = $("<div>");
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    var txt = $("<input>").attr("type", "text").addClass("form-control");
    
    preview.append(txt);
    
    return preview;
  }
}

function TextareaOption() {
  var optDiv = $("<div>");
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    var txt = $("<textarea>").addClass("form-control");
    
    preview.append(txt);
    
    return preview;
  }
}

function CheckboxOption(formBlock) {
  var optDiv = $("<div>");
  
  var optionList = [];
  
  var btnAddOption = $("<button>")
                    .addClass("btn")
                    .attr("type", "button")
                    .html("Add Option");
  
  var addCheckboxOption = function(existingOption) {
    var optRow = $("<div>").addClass("input-group");
    
    var optInput = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Write your option here");
    
    var inputGroupAddon = $("<span>").addClass("input-group-addon");
    
    var optDelete = $("<button>").attr("type", "button").addClass("btn btn-xs").html("Delete Option");
    
    optInput.val(existingOption || "")
    
    inputGroupAddon.append(optDelete);
    optRow.append(optInput);
    optRow.append(inputGroupAddon);
    
    optDiv.append(optRow);
    
    optionList.push(optInput);
    formBlock.options.push(optInput.val());
    
    optInput.change(function() {
      var value = optInput.val();
      
      var index = optionList.indexOf(optInput);
      
      formBlock.options[index] = value;
    });
    
    optDelete.click(function() {
      optRow.remove();
      
      var index = optionList.indexOf(optInput)
      optionList.splice(index, 1);
      
      formBlock.options.splice(index, 1);
    });
  }
  
  btnAddOption.click(function addOption() { addCheckboxOption() });
  optDiv.append(btnAddOption);
  
  for (var i=0; i<formBlock.existingOptions.length; i++) {
    var existingOption = formBlock.existingOptions[i];
    addCheckboxOption(existingOption);
  }
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionList = function() {
    return optionList;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    for (var i=0; i<optionList.length; i++) {
      var opt = optionList[i];
      
      var row = $("<div>").addClass("checkbox");
      var cb = $("<input>").attr("type", "checkbox");
      var label = $("<label>");
      
      label.append(cb);
      label.append($("<span>").html(opt.val()));
      row.append(label);
      
      preview.append(row);
    }
    
    return preview;
  }
}

function RadioOption(formBlock) {
  var optDiv = $("<div>");
  
  var optionList = [];
  
  var btnAddOption = $("<button>")
                    .addClass("btn")
                    .attr("type", "button")
                    .html("Add Option");
  
  var addRadioOption = function(existingOption) {
    var optRow = $("<div>").addClass("input-group");
    
    var optInput = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Write your option here");
    
    var inputGroupAddon = $("<span>").addClass("input-group-addon");
    
    var optDelete = $("<button>").attr("type", "button").addClass("btn btn-xs").html("Delete Option");
    
    optInput.val(existingOption || "")
    
    inputGroupAddon.append(optDelete);
    optRow.append(optInput);
    optRow.append(inputGroupAddon);
    
    optDiv.append(optRow);
    
    optionList.push(optInput);
    formBlock.options.push(optInput.val());
    
    optInput.change(function() {
      var value = optInput.val();
      
      var index = optionList.indexOf(optInput);
      
      formBlock.options[index] = value;
    });
    
    optDelete.click(function() {
      optRow.remove();
      
      var index = optionList.indexOf(optInput)
      optionList.splice(index, 1);
      
      formBlock.options.splice(index, 1);
    });
  }
  
  btnAddOption.click(function addOption() { addRadioOption() });
  optDiv.append(btnAddOption);
  
  for (var i=0; i<formBlock.existingOptions.length; i++) {
    var existingOption = formBlock.existingOptions[i];
    addRadioOption(existingOption);
  }
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionList = function() {
    return optionList;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    var name = new Date().getTime();
    
    for (var i=0; i<optionList.length; i++) {
      var opt = optionList[i];
      
      var row = $("<div>").addClass("radio");
      var cb = $("<input>").attr("type", "radio").attr("name", name);
      var label = $("<label>");
      
      label.append(cb);
      label.append($("<span>").html(opt.val()));
      row.append(label);
      
      preview.append(row);
    }
    
    return preview;
  }
}

function ComboOption(formBlock) {
  var optDiv = $("<div>");
  
  var optionList = [];
  
  var btnAddOption = $("<button>")
                    .addClass("btn")
                    .attr("type", "button")
                    .html("Add Option");
  
  var addComboOption = function(existingOption) {
    var optRow = $("<div>").addClass("input-group");
    
    var optInput = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Write your option here");
    
    var inputGroupAddon = $("<span>").addClass("input-group-addon");
    
    var optDelete = $("<button>").attr("type", "button").addClass("btn btn-xs").html("Delete Option");
    
    optInput.val(existingOption || "")
    
    inputGroupAddon.append(optDelete);
    optRow.append(optInput);
    optRow.append(inputGroupAddon);
    
    optDiv.append(optRow);
    
    optionList.push(optInput);
    formBlock.options.push(optInput.val());
    
    optInput.change(function() {
      var value = optInput.val();
      
      var index = optionList.indexOf(optInput);
      
      formBlock.options[index] = value;
    });
    
    optDelete.click(function() {
      optRow.remove();
      
      var index = optionList.indexOf(optInput)
      optionList.splice(index, 1);
      
      formBlock.options.splice(index, 1);
    });
  }
  
  btnAddOption.click(function addOption() { addComboOption() });
  optDiv.append(btnAddOption);
  
  for (var i=0; i<formBlock.existingOptions.length; i++) {
    var existingOption = formBlock.existingOptions[i];
    addComboOption(existingOption);
  }
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionList = function() {
    return optionList;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    var select = $("<select>").addClass("form-control");
    
    for (var i=0; i<optionList.length; i++) {
      var opt = optionList[i];
      
      var option = $("<option>").attr("value", opt.val()).text(opt.val());
      select.append(option);
    }
    preview.append(select);
    
    return preview;
  }
}

function ScaleOption(formBlock) {
  var optDiv = $("<div>");
  
  var comboStart = $("<select>").addClass("form-control");
  var comboEnd = $("<select>").addClass("form-control");
  
  comboStart.append($("<option>").attr("value", 0).text(0));
  comboStart.append($("<option>").attr("value", 1).text(1));
  
  for (var i=0; i<=10; i++) {
    comboEnd.append($("<option>").attr("value", i).text(i));
  }
  
  if (formBlock.scale) {
    comboStart.val(formBlock.scale.start);
    comboEnd.val(formBlock.scale.end);
  }
  
  optDiv.append(comboStart);
  optDiv.append($("<span>").html("to"));
  optDiv.append(comboEnd);
  
  var addComboOption = function(existingOption) {
    var comboStart = $("<select>").addClass("form-control");
    var comboEnd = $("<select>").addClass("form-control");
  }
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionList = function() {
    return optionList;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    preview.append($("<span>").addClass("radio-inline").html(formBlock.scale.startLabel));
    
    var name = new Date().getTime();
    for (var i=formBlock.scale.start; i<=formBlock.scale.end; i++) {
      
      var label = $("<label>").addClass("radio-inline");
      var radio = $("<input>").attr("type", "radio").attr("value", i).attr("name", name);
      label.append(radio);
      label.append($("<span>").html(i));
      preview.append(label);
    }
    
    preview.append($("<span>").addClass("radio-inline").html(formBlock.scale.endLabel));
    
    return preview;
  }
}