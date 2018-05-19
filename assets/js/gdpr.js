function GAnalytics() {
  this.disclaimer = 'i will use it only for good';

  let gaTrackingId = 'UA-55876783-5';
  let gaDisable = 'ga-disable-' + gaTrackingId;

  try {
    window.dataLayer = window.dataLayer || [];
  } catch (e) {
  }

  this.enable = function () {
    window[gaDisable] = false;

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', gaTrackingId, {
      'anonymize_ip': true,
      'cookie_domain': 'pawelzny.com',
      'cookie_expires': 0,
    });
  };
  this.disable = function () {
    window[gaDisable] = true;
  };
}

function Disqus(shortname) {
  this.disclaimer = 'do you wanna disqus?';
  this.shortname = shortname;

  this.enable = function () {
    let dsq = document.createElement('script');

    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + this.shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  };
  this.disable = function () {
    try {
      DISQUS.reset()
    } catch (e) {
    }
  }
}

function GDPR() {
  this.services = {};
  this.agreements = {};

  for (let i = 0; i < arguments.length; i++) {
    let service = arguments[i];
    this.services[service.constructor.name] = service
  }

  this.renderDisclaimer = function (selector, serviceName) {
    let service = this.services[serviceName];
    let hasAgreement = this.agreements[serviceName] === false;
    if (service && ! hasAgreement) {
      // render agreement disclaimer for service
    }

    return this;
  };

  this.fetchAgreements = function () {};
  this.setAgreements = function () {};
  this.delAgreements = function () {};
}
