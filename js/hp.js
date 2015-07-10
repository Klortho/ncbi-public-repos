/* HP-935: Add a unique id to all empty <a> */
(function ($) {
    $(function () {
        /*
         extract all <a> without an id
         iterate over the <a> set

         if it has an id, skip the iteration

         otherwise, grab its closest ancestor that has an id
         if the $ancestor has immediate children, update @Id of
         those children to ancestor.attr('id') + '_' + child.index()
         else:
         get the count from ancestor.data()
         ancestor.attr('id') + '_' + count
         */

        var $allA = $('a:not([id])');

        $allA.each(function (i, el) {
            var $this = $(el);

            if (typeof $this.attr('id') !== 'undefined' && typeof $this.attr('id') !== '') {
                return true;
            }

            var $ancestor = $this.parent().closest("[id]");
            if ($ancestor.length) {
                var ancestorId = $ancestor.attr('id');

                // if the $ancestor has immediate children, update @Id of those
                // children to ancestor.attr('id') + '_' + child.index()
                var $ancestorChildrenWithNoId = $ancestor.children('a:not([id])');

                if ($ancestorChildrenWithNoId.length) {
                    $ancestorChildrenWithNoId.each(function (aIndex, aElem) {
                        $(aElem).attr('id', ancestorId + '_' + aIndex);
                    });
                    $ancestor.data('count-a-without-id', $ancestorChildrenWithNoId.length);
                } else {
                    var count = typeof $ancestor.data('count-a-without-id') !== 'undefined' ? $ancestor.data('count-a-without-id') : 1;
                    $this.attr('id', ancestorId + '_' + count);
                    $ancestor.data('count-a-without-id', count + 1);
                }
            }
        });
    });
})(jQuery);

// Feedback buttons
(function ($) {
    $(function () {

        var $feedbackLinks = $('.sticky-feedback'),
            $feedbackForm = $('#sticky-feedback-form');
        var $text = $('#feedback-comment');

        if ($feedbackLinks.length && $feedbackForm.length) {
            var config = {
                width: '500', title: 'Feedback',
                modal: true, draggable: false
            };

            $feedbackLinks.on('click', function (evt) {
                if ($feedbackForm.hasClass('ui-dialog-content') !== true) {
                    $text.val('');
                    $feedbackForm.ncbidialog(config);
                }
                $feedbackForm.ncbidialog('open');
                return false;
            });

            $feedbackForm.on('click', '#feedback-close', function () {
                $feedbackForm.ncbidialog('close');
            });


            $feedbackForm.on('click', '#feedback-submit-again', function () {
                $('#feedback-close').hide();
                $('#feedback-header').text('Feedback');
                $('.feedback-field').show();
                $(this).remove();
                $feedbackForm.find('form')[0].reset();

            });

            $feedbackForm.on('click', '#feedback-submit', function () {
                var postURL = '//www.ncbi.nlm.nih.gov/sites/ehelp';
                if ($text.val() === '') {
                    $text.focus();
                } else {
                    var data = {
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.Body': $text.val(),
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.FormType': 'feedback',
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.Ncbi_App': 'guide4beta',
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.Subject': 'guide4beta User Feedback',
                        'p$a': 'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.SendForm',
                        'p$l': 'EntrezHelp',
                        'p$st': 'ehelp',
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.EHelpFormField': '',
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.BrowserUserAgent': window.navigator.userAgent,
                        'EntrezHelp.EntrezHelpCluster.EntrezHelpForm.Date_Time': new Date()

                    };

                    if ($('#FeedbackPage').val() !== '') {
                        data.FeedbackPage = $('#FeedbackPage').val();
                    }

                    if ($('#FeedbackType').val() !== '') {
                        data.FeedbackType = $('#FeedbackType').val();
                    }

                    $('#feedback-close').show();
                    $('#feedback-header').text('Thank you.').after($('<a href="#" id="feedback-submit-again"><br/>← Submit another comment</a>'));
                    $('.feedback-field').hide();
                    crossDomainPost(postURL, data);
                }
            });
        }

        function crossDomainPost(postURL, data) {
            // if iframe#post_to_ehelp exists, use it
            var iframe = document.getElementById('post_to_ehelp') || document.createElement("iframe");
            var uniqueString = "postToEHelp";

            document.body.appendChild(iframe);

            //iframe.style.display = "none";
            // If Iframe has display=none, then it will not work with chrome
            // so use the width=1px, and height=1px instead
            iframe.width = "1px";
            iframe.height = "1px";

            iframe.contentWindow.name = uniqueString;
            iframe.id = 'post_to_ehelp';

            // construct a form with hidden inputs, targeting the iframe
            var form = document.createElement("form");
            form.target = uniqueString;
            form.action = postURL;
            form.method = "POST";
            form.enctype = 'application/x-www-form-urlencoded';
            form.id = 'feedbackPostForm';
            for (var key in data) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            // do not remove iframe immediately as the destination page may
            // still be loading
            // just leave it on the page, it wont hurt.
            // iframe.remove();

        }
    });
})(jQuery);

(function () {
    // add back_url
    var els = document.querySelectorAll('a.add-back-url');
    for (var i = 0; i < els.length; i++) {
        var href = els[i].href;
        els[i].href = href + '?back_url=' + document.location.href;
    }
})();

function isMyNCBIUserLoggedIn() {
    var c = getCookie('WebCubbyUser');
    return ( c !== "" && c.indexOf('logged-in=true') !== -1 )
}
