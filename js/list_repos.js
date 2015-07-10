$(document).ready(function() {

  var github_ncbi_url = 'http://github.com/ncbi';

  // Get the NCBI metadata about the repos, and the GitHub info,
  // and merge them.  This starts fetching both of them at the same
  // time.
  var repos_info_promise = fetch("repos.yaml");
  var repos_github_promise = fetch("https://api.github.com/orgs/ncbi/repos");

  // Now handling the asyncronous responses is chained together.
  var repos_info;
  repos_info_promise
    .then(function(response) {
      return response.text();
    })
    .then(function(yaml_str) {
      //console.log(yaml_str);
      repos_info = jsyaml.load(yaml_str);
      return repos_github_promise;
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(repos_json) {
      var data2 = [];
      repos_json.forEach(function(repo) {
        var name = repo.name;
        var name_link = '<a href="' + github_ncbi_url + '/' + name + '">' + name + '</a>';
        // construct a row: name, topic, description
        data2.push([
          name_link,
          name in repos_info ? repos_info[name].topic : "unknown",
          repo.description
        ]);
      });
      $('#repos').DataTable({
        data: data2,
        //pageLength: 25
      });
    });

  // This filters the table based on given topic
  function filter_topic(topic) {
    var t = $('#repos').DataTable();
    t.column( [1] ).search(topic).draw();
  }

  $('.topics').find('li').on('click', function(evt) {
    filter_topic($(this).text());
    return false;
  });

  $('#clear_topic').on('click', function(evt) {
    filter_topic('');
    return false;
  });
});
