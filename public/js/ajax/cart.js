
    var url = "/order";
    var tafel_id = $('#tafel').val();
    var bezet = $('#status').val();

    function OrderList() {
        var total = 0;
        $.ajax({
            type: "GET",
            url: url + '/' + tafel_id,
            success: function (data) {
                // console.log(data);
                var html_excluded = '';
                var html_item = '';

                $.each(data, function(k, v) {

                    $.each(v.excluded, function(k1, v1) {
                        html_excluded += '<li class="">geen: '+ v1.ingredient.ingredient  +'</li>';
                    });

                    html_item +=
                        '<li class="' + v.status + ' list-group-item" style="height: auto;">' +
                            '<span class="">' + v.product.naam + '</span>' +
                            '<span class="badge"> ' + v.product.prijs + ' </span>' +
                            '<span class="hidden id"> ' + v.id + ' </span>' +
                            '<span class="hidden product_id"> ' + v.product.id + ' </span>' +
                            '<span class="badge ">' + v.status + '</span>'+
                            '<ul id="excluded-items-'+ v.id +'">'+ html_excluded + '</ul>'+
                        '</li>';

                    html_excluded = '';

                    total += parseFloat(v.product.prijs);
                });

                var html_order = '<ul class="list-group">';
                html_order +=  html_item;
                    html_order += '<li class="list-group-item"> totaal <span class="badge">€ ' + total + '</span></li>';
                html_order += '</ul>';

                $("#order").html(html_order);
            }
        });
    }

    setInterval(OrderList, 1000);
    OrderList();

    $("#option").on('click', '#btn-save', function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        e.preventDefault();

        var formData = {
            tafel_id : $('#tafel').val(),
        };

        $.ajax({
            type: "POST",
            url: url + '/save',
            data: formData,
            dataType: 'json',
            success: function (data) {
                OrderList();
                // console.log(data);
            }
        });
    });

    $("#order").on('click', '.open', function (e) {
        var orderedItem = $(this).find('.id').text();
        var productId = parseInt($(this).find('.product_id').text());
        // console.log(productId);

        $.ajax({
            type: "GET",
            url: url + '/product/' + productId,
            success: function (data) {
                // console.log(data[0]);
                $("#product-naam").append().text('order wijziging: ' + data[0].product.naam);
                $("#ordered-item").append().val(orderedItem);

                var html_order = '<div class="row">';

                $.each(data, function(k, v) {
                    console.log(v);
                    html_order += '<div class="col-lg-4" style="margin-bottom: 0px;">';
                        html_order += '<input type="checkbox" name="ingredients[]" value="' + v.ingredient.id + '" class="ingredients" >';
                        html_order += '<label>' + v.ingredient.ingredient + '</label>';
                    html_order += '</div>';
                });

                html_order += '</div>';

                $(".modal-body").html(html_order);

                $('.modal').modal('show');
            }
        });
    });


    $("#my-ingredients").on('click', '#btn-add', function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        e.preventDefault();

        var ingredients = [];
        $('.ingredients:checked').each(function(i){
            ingredients[i] = parseInt($(this).val());
        });

        // console.log($('#id').val());

        $.ajax({
            type: 'POST',
            url: '/order/excluded',
            data: {
                ingredients : ingredients,
                ordered_item_id : parseInt($('#ordered-item').val()),
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                $('.modal').modal('hide');
            },
            error: function (data) {
                // console.log(data);

            }
        });
    });

    $("#menu").on('click', '#btn-menu', function () {
        $(".menu").hide();
        $(".btn-menu").removeClass('active');
        $(".menu-item-" + $(this).val()).addClass('active');
        $(".menu-" + $(this).val()).show();
    });

    //delete task and remove it from list
    $('#tasks-list').on('click', '.delete-task',function(){
        var row_id = $(this).val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            type: "DELETE",
            url: url + '/' + row_id,
            success: function (data) {
                $("#task" + row_id).remove();
            }
        });
    });

    //create new task / update existing task
    $("#product").on('click', '#btn-add', function (e) {
        var product_id = $(this).val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        e.preventDefault();

        var formData = {
            product_id : product_id,
            tafel_id : tafel_id,
            status : bezet,
        };

        $.ajax({
            type: "POST",
            url: url + '/add',
            data: formData,
            dataType: 'json',
            success: function (data) {
                OrderList();
            }
        });
    });