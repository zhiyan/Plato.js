# Plato.js - a micro template engine with JavaScript

## Usage

1. include the js :`<script src="../plato.js"></script>`
2. coding like these:
    
        <script type="text/plato-template" id="template">
    	<h1>hello {{name}} !</h1>

        {{#with info}}
        <p>
            {{location}} {{family}}
        </p>
        {{/with}}

        <p>{{info.location}}</p>

    	<ul>
    		{{#each list}}
    		<li>name: {{id}}</li>
    		<li>id: {{name}}</li>
    		{{/each}}
    	</ul>
    
    	{{#if name}}<h2>{{name}}</h2>{{/if}}
    </script>
    
        <script>
        	var html = document.getElementById("template").innerHTML;
        	var data = {
        			"name":"zhiyan",
                    "info" : {
                        "location" : "xxx",
                        "family" : "xxx"
                    },
        			"list":[
        				{"id":1,"name":"zhiyan"},
        				{"id":2,"name":"wang"}
        			]};
        	var build= P(html);
        </script>
    

## Features

* Support each/if/with for now
* Only 1/3 size of mustache.js
* Very quick, maybe. Nearly all based regexp.
* Don't depend on the third part library, like jQuery.
* I codding it just for fun.
