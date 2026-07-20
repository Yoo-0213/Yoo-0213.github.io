function set_image_size(image, width, height) 
{
    image.setAttribute("width", width + "px");
    // 如果没有指定高度，只设宽度，高度可以不用管（浏览器会自动等比缩放）
    if (height) {
        image.setAttribute("height", height + "px");
    }
}

function hexo_resize_image()
{
    var imgs = document.getElementsByTagName('img');
    for (var i = imgs.length - 1; i >= 0; i--) 
    {
        var img = imgs[i];

        // 【修改点 1】不再读取 src，而是读取 alt 属性（对应 ![1300] 里的内容）
        var altText = img.getAttribute('alt');
        if (!altText) continue; // 如果图片没有 alt，跳过

        // 【修改点 2】用正则匹配 alt 里面的“宽x高”格式（例如 1300x500）
        var fields = altText.match(/\d*x\d*/g);
        if (fields && fields.length == 1)
        {
            var values = fields[0].split("x");
            if (values.length == 2)
            {
                var width = values[0];
                var height = values[1];

                if (!(width.length && height.length))
                {
                    var n_width = img.naturalWidth;
                    var n_height = img.naturalHeight;
                    if (width.length > 0)
                    {
                        height = n_height*width/n_width;
                    }
                    if (height.length > 0)
                    {
                        width = n_width*height/n_width;
                    }
                }
                set_image_size(img, width, height);
            }
            continue;
        }

        // 【修改点 3】匹配纯数字（对应你写的 ![1300]）
        fields = altText.match(/^\d+$/);
        if (fields)
        {
            var width = parseFloat(fields[0].toString());
            // 如果只写了宽度（比如 1300），高度让浏览器自适应或按原图比例计算
            set_image_size(img, width, null);
        }
    }
}
window.onload = hexo_resize_image;