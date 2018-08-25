import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  actions: {
    lookup(login) {
      if (!Ember.isEmpty(login)) {
        return this.transitionTo('account', login);
      }
    },
    calculate(hashRate) {
      if (!Ember.isEmpty(hashRate)) {
        var url = '//' + window.location.hostname + '/api/stats';
        Ember.$.getJSON(url).then(function(data) {

            var result = '<div class="col-md-12"><br/><h2><span class="label label-warning">We give the BEST profit in the world</span></h2><div class="note note-info">';
            result += '<span>';
            result += '<p>Estimation of profits for <span class="label label-success">' + hashRate + '</span> MH/s and difficulty <span class="label label-success">' +  data.nodes[0].difficulty + '</span>:</p>';

            result += '<dl class="dl-horizontal">';
            var intervals = [1, 3, 7, 14, 30];
            var ppsRate = 4 * (1 - config.APP.PoolFee / 100) / data.nodes[0].difficulty;
            for (var i = 0; i < intervals.length; ++i) {
                var seconds = intervals[i] * 86400;
                var hashes = hashRate * Math.pow(10, 6) * seconds;
                result += '<dt>' + intervals[i] + 'd</dt>';
                result += '<dd>' + (hashes * ppsRate).toFixed(8)  +  ' ETC</dd>';
            }

            result += '</dl>';
            result += '</span>';
            result += '<p>Estimation is accurate only for zero-variance PPS mode. HVPPS incomings are subject to share based variance.</p>';
            result += '</div>';
            result += '<h3>Comparation our profit with the World:</h3><div class="note note-danger"><ul class="list-unstyled"><li><a href="https://whattomine.com/coins/162-etc-ethash?hr=' + hashRate + '" target="_blank">Whatomine.com (<small class="text-muted">Mining in Perfect conditional</small>)</a></li><li><a href="https://www.cryptocompare.com/mining/calculator/etc?HashingPower=' + hashRate + '" target="_blank">Cryptocompare.com(<small class="text-muted">Mining in regular Pool in the world</small>)</a></li></ul></div>';
            result += '</div>';

            document.getElementById('calculation-result').innerHTML = result;
        });

      }
    }
  }
});
