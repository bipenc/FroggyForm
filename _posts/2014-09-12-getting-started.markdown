---
layout: post
title:  "Getting started"
date:   2014-09-12 10:03:05
categories: tutorials
---

Here's how to get started with Froggy Form.

{% highlight javascript %}
// #form1 can be a ul or a ol
var container = $("#form1");
var ff = new FroggyForm(container);

$("#btn1").click(function(e){
  e.preventDefault();
  
  var question = ff.addQuestion({formType: "checkboxes"});
  $("#form1").append(question.getView());
});
{% endhighlight %}


Other supported form types are

text

paragraph

checkboxes

multiplechoice

choosefromalist

scale