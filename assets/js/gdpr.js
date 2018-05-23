function GAnalytics() {
  this.disclaimer = 'I agree for anonymous tracking of my activity. I acknowledge that this helps to provide more content I\'m interested in.';

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
  this.disclaimer = 'I acknowledge that comments are available thanks to Disqus. I agree for cookies from Disqus.';
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
    this.services[service.constructor.name] = service
  }

  this.renderDisclaimer = function (selector, serviceName) {
    let service = this.services[serviceName];
    let hasAgreement = this.agreements[serviceName] === false;
    if (service && !hasAgreement) {
      let disclaimer = $(selector);
      disclaimer.find('.disclaimer-text').text(service.disclaimer);
      disclaimer.find('.disclaimer-agree').on('click', function (event) {
        console.log(event);
      });
    }

    return this;
  };

  this.fetchAgreements = function () {};
  this.setAgreements = function () {};
  this.delAgreements = function () {};
}
