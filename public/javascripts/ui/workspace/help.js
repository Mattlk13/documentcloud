// The Help tab.
dc.ui.Help = dc.View.extend({

  PAGES : ['', 'searching', 'accounts', 'uploading', 'notes', 'publishing', 'collaboration', 'troubleshooting'],

  callbacks : {
    '.contact_us.click':  'openContactDialog',
    '.uservoice.click':   'openUserVoice'
  },

  constructor : function() {
    this.el = $('#help')[0];
    this.currentPage = null;
  },

  render : function() {
    dc.history.register(/^#help\//, _.bind(this.openPage, this));
    dc.history.register(/^#help$/, _.bind(this.openPage, this, ''));
    dc.app.navigation.bind('help', _.bind(this.openHelpTab, this));
    this._toolbar = $('#help_toolbar');
    this._toolbar.prepend(this._createHelpMenu().render().el);
    this.setCallbacks();
    return this;
  },

  openContactDialog : function() {
    dc.ui.Dialog.prompt('Contact Us', '', function(message) {
      $.post('/help/contact_us', {message : message}, function() {
        dc.ui.notifier.show({mode : 'info', text : 'Your message was sent successfully.'});
      });
      return true;
    }, {
      text     : 'Use this form (or email to <a href="mailto:support@documentcloud.org">support@documentcloud.org</a>) to contact us for assistance. \
                  If you need to speak to someone immediately, you can call us at (646) 450-2162.<br /> \
                  See <a href="http://www.documentcloud.org/contact">documentcloud.org/contact</a> for more ways to get in touch.',
      saveText : 'Send'
    });
  },

  openUserVoice : function() {
    window.open('http://documentcloud.uservoice.com');
  },

  openPage : function(page) {
    var noChange = !_.include(this.PAGES, page) || (page === this.currentPage);
    this.currentPage = page;
    this.saveHistory();
    if (noChange) return dc.app.navigation.open('help');
    $.get("/help/" + (page || 'index') + '.html', function(resp) {
      $('#help_content').html(resp);
    });
    dc.app.navigation.open('help');
  },

  openHelpTab : function() {
    this.currentPage ? this.saveHistory() : this.openPage('');
  },

  saveHistory : function() {
    dc.history.save('help/' + (this.currentPage || ''));
  },

  _createHelpMenu : function() {
    return this.menu = new dc.ui.Menu({
      id      : 'how_to_menu',
      label   : 'Guides &amp; How To\'s',
      items   : [
        {onClick : _.bind(this.openPage, this, ''),               title : 'Introduction'},
        {onClick : _.bind(this.openPage, this, 'searching'),      title : 'Searching Documents'},
        {onClick : _.bind(this.openPage, this, 'accounts'),       title : 'Adding Accounts'},
        {onClick : _.bind(this.openPage, this, 'uploading'),      title : 'Uploading Documents'},
        {onClick : _.bind(this.openPage, this, 'notes'),          title : 'Editing Notes and Sections'},
        {onClick : _.bind(this.openPage, this, 'publishing'),     title : 'Publishing &amp; Embedding'},
        {onClick : _.bind(this.openPage, this, 'collaboration'),  title : 'Collaboration'},
        {onClick : _.bind(this.openPage, this, 'troubleshooting'),title : 'Troubleshooting Failed Uploads'}
      ]
    });
  }

});