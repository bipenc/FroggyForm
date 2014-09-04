var FroggyForm = function(options) {
  var formType = options.formType;
  
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
              
  var btnDone = $("<button>").attr("type", "button").html("Done");
  
  
  inputBlock.append(txtQuestion);
  inputBlock.append(optionsBlock);
  block.append(inputBlock);
  
  var option;
  if (formType == "textfield") {
    option = new TextboxOption();
  } else if (formType == "textarea") {
    option = new TextareaOption();
  } else if (formType == "checkbox") {
    option = new CheckboxOption();
  }
  
  optionsBlock.append(option.getView());
  
  var divDone = $("<div>").addClass("done");
  divDone.append(btnDone);
  
  inputBlock.append(divDone);
  
  
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

function CheckboxOption() {
  var optDiv = $("<div>");
  
  var optionList = [];
  
  var btnAddOption = $("<button>")
                    .attr("type", "button")
                    .html("Add Option");
  
  btnAddOption.click(function() {
    var optRow = $("<div>");
    
    var optInput = $("<input>").attr("type", "text");
    var optDelete = $("<button>").attr("type", "button").html("Delete Option");
    
    optRow.append(optInput);
    optRow.append(optDelete);
    
    optDiv.append(optRow);
    
    optionList.push(optInput);
    
    optDelete.click(function() {
      optRow.remove();
      optionList.splice(optionList.indexOf(optInput), 1);
    });
  });
  
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