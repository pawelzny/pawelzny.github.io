function GAnalytics() {
  this.disclaimer = 'I agree for anonymous tracking of my activity. I acknowledge that this helps to provide more content I\'m interested in.';
  this.displayName = 'Google Analytics';
  this.active = false;

  let gaTrackingId = 'UA-55876783-5';
  let gaDisable = 'ga-disable-' + gaTrackingId;

  this.enable = function () {
    delete window[gaDisable];
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', gaTrackingId, {
      'anonymize_ip': true,
      'cookie_expires': 0,
    });
  };
  this.disable = function () {
    window[gaDisable] = true;
    delete window['gtag'];

    Object.keys($.cookie()).forEach(key => {
      if (key.startsWith('_g')) {
        $.removeCookie(key, {path: '/'});
      }
    });
  };
}

function Disqus(shortname) {
  this.disclaimer = 'I acknowledge that comments are available thanks to Disqus. I agree to enable Disqus.';
  this.displayName = 'Disqus';
  this.shortname = shortname;
  this.active = false;

  this.enable = function () {
    let dsq = document.createElement('script');

    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + this.shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  };
  this.disable = function () {
    try {
      DISQUS.reset();
    } catch (e) {
    }
  }
}

function GDPR() {
  this.services = {};
  this.agreements = {};

  for (let i = 0; i < arguments.length; i++) {
    let service = arguments[i];
    this.services[service.displayName] = service;
    this.agreements[service.displayName] = JSON.parse(localStorage.getItem(service.displayName));
  }

  this.renderDisclaimer = function (selector, serviceName) {
    let service = this.services[serviceName];
    let agreements = this.agreements;
    let hasAgreement = agreements[serviceName] !== null;

    if (service && !hasAgreement) {
      let disclaimer = $(selector);
      let self = this;

      disclaimer.show();
      disclaimer.find('.disclaimer-text').text(service.disclaimer);
      disclaimer.find('.disclaimer-agree').on('click', function (event) {
        let $btn = $(event.currentTarget);
        let agr = {agreed: $btn.data('agree'), when: (new Date()).toString()};

        agreements[serviceName] = agr;

        localStorage.setItem(serviceName, JSON.stringify(agr));
        disclaimer.remove();

        self.apply();
      });
    }

    return this;
  };

  this.apply = function () {
    Object.keys(this.agreements).forEach(key => {
      let val = null;
      try {
        val = this.agreements[key];
      } catch (e) {
      }

      if (val && val.agreed === 'yes' && this.services[key].active === false) {
        this.services[key].enable();
        this.services[key].active = true;
      } else if (! val || val.agreed !== 'yes') {
        this.services[key].disable();
        this.services[key].active = false;
      }
    });
  }
}
