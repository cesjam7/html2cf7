$(document).ready(function(){
    init_convert("#cam_html", "#cam_cf7");
    function init_convert(textarea_origin, textarea_destiny){
        $(textarea_origin).keyup(function(){
            html2cf7(textarea_origin, textarea_destiny);
        });
        $(textarea_origin).change(function(){
            html2cf7(textarea_origin, textarea_destiny);
        });
    }
    function html2cf7(textarea_origin, textarea_destiny){
        var html = "";
        var origin = $(textarea_origin).val();

        origin = origin.replace(/'/g, '"');
        origin = origin.split("\n");
        for (var i = 0; i < origin.length; i++) {
            if(origin[i].indexOf('input') > -1){
                espacios = origin[i].split('<input ');
                code = espacios[0];
                origin[i] = espacios[1].replace('>', '');
                origin[i] = origin[i].replace('/', '');
                html += code + analyze_attr(origin[i], 'input') + "\n";
            }else if(origin[i].indexOf('textarea') > -1){
                espacios = origin[i].split('<textarea ');
                code = espacios[0]+"[";
                origin[i] = espacios[1].replace("></textarea>", "");
                html += code + analyze_attr(origin[i], 'textarea') + "\n";
            }else{
                html += origin[i]+'\n';
            }

        }

        $(textarea_destiny).val(html);
    }
    function analyze_attr(code, type){
        value = "";
        attr = code.split('" ');
        for (var c = 0; c < attr.length; c++) {
            attr[c] = attr[c].replace(/"/g, '');
            if(type=="textarea" && c==0){
                value += "textarea ";
            }
            if(attr[c].indexOf('type=') > -1){
                attr[c] = attr[c].replace("type=", "[");
                value += attr[c]+" ";
            }else if(attr[c].indexOf('class=') > -1){
                value += attr_class_id('class', attr[c]);
            }else if(attr[c].indexOf('id=') > -1){
                value += attr_class_id('id', attr[c]);
            }else if(attr[c].indexOf('name=') > -1){
                value = attr_name(attr[c], value);
            }else if(attr[c].indexOf('placeholder=') > -1){
                value += attr_placeholder(attr[c]);
            }else if(attr[c].indexOf('value=') > -1){
                value += attr_value(attr[c]);
            }
        }
        value += ']';
        value = value.replace('" ]', '"]');
        return value;
    }
    function attr_placeholder(code){
        placeholder = 'placeholder "';
        placeholder += code.replace("placeholder=", "");
        placeholder += '"';
        return placeholder;
    }
    function attr_value(code){
        value = '"';
        value += code.replace("value=", "");
        value += '"';
        return value;
    }
    function attr_class_id(type, code){
        value = "";
        clase = code.replace(type+'=', '');
        clase = clase.split(' ');
        for (var i = 0; i < clase.length; i++) {
            value += type+":"+clase[i]+" ";
        }
        return value;
    }
    function attr_name(code, value){
        name = code.replace('name=', '');
        explode = value.split(' ');
        value = "";
        for (var i = 0; i < explode.length; i++) {
            if(i==1){
                value += name+' ';
            }
            value += explode[i]+' ';
        }
        return value.replace('  ', ' ');
    }
    $("#select_all").click(function(e) {
        e.preventDefault();
        var textarea = $("#cam_cf7");
        textarea.select();

        // Work around Chrome's little problem
        textarea.mouseup(function() {
            // Prevent further mouseup intervention
            textarea.unbind("mouseup");
            return false;
        });
    });
})
