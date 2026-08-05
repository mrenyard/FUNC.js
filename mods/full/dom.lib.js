/**
 * FUNC.js - Frontend Utilities for Networked Client (js).
 * @author Matt Renyard (renyard.m@gmail.com)
 * @package func.dom
 * @version 0.1;
 */
var FUNC = window.FUNC || {};
FUNC.version = FUNC.version || .1;

/**
 * HTML - Document Object Manipulation (DOM) libary.
 */
FUNC.dom = function()
{
  //- USE (dependant namespaces)
  let N = FUNC.Enum,
      Ex = FUNC.Exception,
      event = FUNC.event;

  //- NAMESPACE PROPERTIES

  //- PRIVATE VARABLES
  var dialog = {}, dHh, dHs, dB1, dB2,
    main = document.getElementById('main'),
    modal = document.getElementById('modal'),
    sectionType = new N('section', 'article', 'section-form', 'dialog-form'), //'record', 'collection'),
    dialogType = new N('message', 'confirm', 'submit', 'reload');

  //- LOCAL METHODS
  var buildSection = function(n, heading, level, classList, footer)
  {
    let i = 0,
      h = document.createElement('header'),
      hx = document.createElement('h' + level),
      o = document.createElement(sectionType.at(n).name.split('-')[0]),
      form = null;
    o.setAttribute('id', heading.replaceAll(' ','-').toLocaleLowerCase());
    if (classList) { while (classList[i]) { o.classList.add(classList[i++]); } }
    hx.append(heading); h.appendChild(hx);
    if (n > 1) {
      form = document.createElement('form');
      form.setAttribute('method','post');
      o.appendChild(form);
    }
    let box = (form !== null) ? form : o;
    box.prepend(h);
    if (footer != undefined) { box.appendChild(footer); }
    return o;
  };

  var updateContents = function(o, content)
  {
    let box = (o.childElementCount == 1 && o.children[0].tagName === 'FORM') ? o.children[0] : o;
    let h = box.querySelector('header'),
      f = box.querySelector('footer');
    box.innerHTML = content;
    if (h) { box.prepend(h); }
    if (f) { box.appendChild(f); }
    return o;
  };

  /**
   * Create new HtmlElement:section within HtmlElement:#main
   * optionally load dynamic FUNC.[module] on it.
   * @template
   * HtmlElement:section
   *  HtmlElement:a
   *  HtmlElement:header
   *   HtmlElement:h2
   * @example
   * FUNC.core.addPageSection(
   *   'Class Model for RAMP (Model, View, controller)',
   *   (document.createElement('div')).setAttribute('class','canvas'),
   *   ['diagram', 'uml-class', 'view-detail'],
   *   FUNC.diagram
   * );
   * @param {string} heading - Heading for new diagram section (`id="attribute-name"`).
   * @param {string[]} classList - Additional `[classList:values]` (excluding module).
   * @param {string} moduleName - Optional `FUNC.[moduleName]` to be executed on new `[HtmlElement:section]`.
   */
  var addPageSection = function(heading, classList, moduleName)
  {
    let o = buildSection(this.sectionType.SECTION, heading, 2, classList),
      a = document.createElement('a');
    a.setAttribute('href', o.id); a.append('#');
    o.prepend(a);
    main.appendChild(o);
    if (moduleName !== undefined) {
      fn = eval('FUNC.' + moduleName);
      FUNC.my[moduleName][FUNC.my[moduleName].length] = fn(o);
    }
  };

  var updateDialog = function(type, heading, summary, extendedSummary = '')
  {
    updateContents(modal, extendedSummary);
    dHh.textContent = heading;
    dHS.textContent = summary;
    switch (type) {
      case 1:
        let bTc = modal.dataset.confirm.split(',');
        dB1.textContent = bTc[0];
        dB2.textContent = bTc[1];
        dB2.hidden = false; 
        break;
      case 2:
        let bTs = modal.dataset.submit.split(',');
        dB1.textContent = bTs[0];
        dB2.textContent = bTs[1];
        dB2.hidden = false; 
        break;
      case 3:
        let bTr = modal.dataset.reload.split(',');
        dB1.textContent = bTr[0];
        dB2.textContent = bTr[1];
        dB2.hidden = false; 
        break;
      case 0:
      default:
        dB1.textContent = 'OK';
        dB2.hidden = true; 
        break;
      }
  };

  //- INITIALISE
  if (modal != null) {
    if (modal.open == true) { modal.open = false; modal.showModal(); }
    let f = modal.querySelector('footer')
    if (f != null) {
      let fS = f.querySelectorAll('button');
      if (fS != null) {
        dB1 = fS[0]; dB2 = fS[1];
      }
    }
    let dH = modal.querySelector('header');
    dHh = dH.querySelector('h2');
    dHS = dH.querySelector('p');
  }

  dialog.open = function() { modal.showModal(); }
  dialog.close = function() { modal.close(); }

  //- PUBLIC ACCESS
  return { main, addPageSection, updateDialog, dialog, dialogType, sectionType, updateContents, buildSection };
}();
