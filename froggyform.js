var FroggyForm = function() {
  var formData = [];
  
  this.getFormData = function() {
    return formData;
  }
  
  this.loadData = function(displayBoard, existingData) {
    for (var i=0; i<existingData.length; i++) {
      var data = existingData[i];
      
      var question = this.addQuestion(data);
      displayBoard.append(question.getView());
    }
  }
  
  //setInterval(function(){ console.log( formData ); }, 5000);
}

FroggyForm.prototype.addQuestion = function(options) {
  var that = this;
  
  var formBlock = {};
  formBlock.question = options.question || "";
  formBlock.formType = options.formType || "textfield";
  formBlock.options = [];
  formBlock.existingOptions = options.options || [];
  
  this.getFormData().push(formBlock);
  
  var block = $("<div>")
                .addClass("block");
                
  var inputBlock = $("<div>")
                .addClass("inputBlock");
                
  var optionsBlock = $("<div>")
                .addClass("optionsBlock");
                
  var txtQuestion = $("<input>")
              .attr("type", "text")
              .addClass("question")
              .attr("placeholder", "Please write your question here.");
  txtQuestion.val(formBlock.question);
              
  var btnDone = $("<button>").attr("type", "button").html("Done");
  
  var btnRemoveBlock = $("<button>").attr("type", "button").html("Remove");
  var divRemove = $("<div>").addClass("remove");
  
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
  if (formBlock.formType == "textfield") {
    option = new TextboxOption();
  } else if (formBlock.formType == "textarea") {
    option = new TextareaOption();
  } else if (formBlock.formType == "checkbox") {
    option = new CheckboxOption(formBlock);
  } else if (formBlock.formType == "radio") {
    option = new RadioOption(formBlock);
  }
  
  optionsBlock.append(option.getView());
  
  var divDone = $("<div>").addClass("done");
  divDone.append(btnDone);
  
  inputBlock.append(divDone);
  
  txtQuestion.change(function() {
    var value = txtQuestion.val();
    
    formBlock.question = value;
  });
  
  
  ///////////////////////////////////////////////////////////////////////////
  
  var previewBlock = $("<div>").addClass("previewBlock");
  
  var previewQuestion = $("<div>").addClass("previewQuestion");
  
  var previewOptions = option.getOptionPreview();
  
  previewBlock.append(previewQuestion);
  previewBlock.append(previewOptions);
  
  txtQuestion.change(function() {
    previewQuestion.html(txtQuestion.val());
  });
  
  btnDone.click(function() {
    previewOptions.remove();
    
    previewOptions = option.getOptionPreview();
    previewBlock.append(previewOptions);
    
    inputBlock.hide();
    previewBlock.show();
  });
  
  // hide preview initially
  previewBlock.hide();
  
  previewBlock.click(function() {
    previewBlock.hide();
    inputBlock.show();
  });
  
  block.append(previewBlock);
  
  /////////////////////////////////////////////////////////////////////////////////
  
  
  this.getView = function() {
    return block;
  }
  
  delete formBlock.existingOptions;
  
  return this;
}

function TextboxOption() {
  var optDiv = $("<div>");
  
  this.getView = function() {
    return optDiv;
  }
  
  this.getOptionPreview = function() {
    var preview = $("<div>");
    
    var txt = $("<input>").attr("type", "text");
    
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
    
    var txt = $("<textarea>");
    
    preview.append(txt);
    
    return preview;
  }
}

function CheckboxOption(formBlock) {
  var optDiv = $("<div>");
  
  var optionList = [];
  
  var btnAddOption = $("<button>")
                    .attr("type", "button")
                    .html("Add Option");
  
  var addCheckboxOption = function(existingOption) {
    var optRow = $("<div>");
    
    var optInput = $("<input>").attr("type", "text").attr("placeholder", "Write your option here");
    var optDelete = $("<button>").attr("type", "button").html("Delete Option");
    
    optInput.val(existingOption || "")
    
    optRow.append(optInput);
    optRow.append(optDelete);
    
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
  
  for (var i=0; i<formBlock.existingOptions.length; i++) {
    var existingOption = formBlock.existingOptions[i];
    addCheckboxOption(existingOption);
  }
  
  optDiv.append(btnAddOption);
  
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
      
      var row = $("<div>");
      var cb = $("<input>").attr("type", "checkbox");
      var label = $("<label>").html(opt.val());
      
      row.append(cb);
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
                    .attr("type", "button")
                    .html("Add Option");
  
  var addCheckboxOption = function(existingOption) {
    var optRow = $("<div>");
    
    var optInput = $("<input>").attr("type", "text").attr("placeholder", "Write your option here");
    var optDelete = $("<button>").attr("type", "button").html("Delete Option");
    
    optInput.val(existingOption || "")
    
    optRow.append(optInput);
    optRow.append(optDelete);
    
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
  
  for (var i=0; i<formBlock.existingOptions.length; i++) {
    var existingOption = formBlock.existingOptions[i];
    addCheckboxOption(existingOption);
  }
  
  optDiv.append(btnAddOption);
  
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
      
      var row = $("<div>");
      var cb = $("<input>").attr("type", "radio");
      var label = $("<label>").html(opt.val());
      
      row.append(cb);
      row.append(label);
      
      preview.append(row);
    }
    
    return preview;
  }
}