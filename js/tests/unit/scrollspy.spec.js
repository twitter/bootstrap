import ScrollSpy from '../../src/scrollspy'
import Manipulator from '../../src/dom/manipulator'

/** Test helpers */
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'

describe('ScrollSpy', () => {
  let fixtureEl

  const onScrollStop = (callback, element, timeout = 30) => {
    let handle = null
    const onScroll = function () {
      if (handle) {
        window.clearTimeout(handle)
      }

      handle = setTimeout(() => {
        element.removeEventListener('scroll', onScroll)
        callback()
      }, timeout + 1)
    }

    element.addEventListener('scroll', onScroll)
  }

  const getDummyFixture = () => {
    return [
      '<nav id="navBar" class="navbar">',
      '  <ul class="nav">',
      '    <li class="nav-item"><a id="li-jsm-1" class="nav-link" href="#div-jsm-1">div 1</a></li>',
      '  </ul>',
      '</nav>',
      '<div class="content" data-bs-target="#navBar">',
      '  <div id="div-jsm-1">div 1</div>',
      '</div>'
    ].join('')
  }

  const testElementIsActiveAfterScroll = ({ elementSelector, targetSelector, contentEl, scrollSpy, spy, cb }) => {
    const element = fixtureEl.querySelector(elementSelector)
    const target = fixtureEl.querySelector(targetSelector)
    // add top padding to fix Chrome on Android failures
    const paddingTop = 5
    const parentOffset = getComputedStyle(contentEl).getPropertyValue('position') === 'relative' ? 0 : contentEl.offsetTop
    const scrollHeight = (target.offsetTop - parentOffset) + paddingTop

    function listener() {
      expect(element.classList.contains('active')).toEqual(true)
      expect(scrollSpy._activeTarget).toEqual(element)
      spy.calls.reset()
      cb()
    }

    setTimeout(() => { // in case we scroll something before the test
      onScrollStop(listener, contentEl)
      contentEl.scrollTo({ top: scrollHeight })
    }, 50)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(ScrollSpy.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(ScrollSpy.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(ScrollSpy.DATA_KEY).toEqual('bs.scrollspy')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const sSpyEl = fixtureEl.querySelector('.content')
      const sSpyBySelector = new ScrollSpy('.content')
      const sSpyByElement = new ScrollSpy(sSpyEl)

      expect(sSpyBySelector._element).toEqual(sSpyEl)
      expect(sSpyByElement._element).toEqual(sSpyEl)
    })

    it('should not process element without target', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link active" id="one-link" href="#">One</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        ' <div id="two" style="height: 300px;">test</div>',
        ' <div id="three" style="height: 10px;">test2</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpy._targetLinks.length).toEqual(2)
    })

    it('should only switch "active" class on current target', done => {
      fixtureEl.innerHTML = [
        '<div id="root" class="active" style="display: block">',
        '  <div class="topbar">',
        '    <div class="topbar-inner">',
        '      <div class="container" id="ss-target">',
        '        <ul class="nav">',
        '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
        '          <li class="nav-item"><a href="#detail">Detail</a></li>',
        '        </ul>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
        '    <div style="height: 200px;" id="masthead">Overview</div>',
        '    <div style="height: 200px;" id="detail">Detail</div>',
        '  </div>',
        '</div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
      const rootEl = fixtureEl.querySelector('#root')
      const scrollSpy = new ScrollSpy(scrollSpyEl, {
        target: '#ss-target'
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      onScrollStop(() => {
        expect(rootEl.classList.contains('active')).toEqual(true)
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      }, scrollSpyEl)

      scrollSpyEl.scrollTo({ top: 350 })
    })

    it('should only switch "active" class on current target specified w element', done => {
      fixtureEl.innerHTML = [
        '<div id="root" class="active" style="display: block">',
        '  <div class="topbar">',
        '    <div class="topbar-inner">',
        '      <div class="container" id="ss-target">',
        '        <ul class="nav">',
        '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
        '          <li class="nav-item"><a href="#detail">Detail</a></li>',
        '        </ul>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
        '    <div style="height: 200px;" id="masthead">Overview</div>',
        '    <div style="height: 200px;" id="detail">Detail</div>',
        '  </div>',
        '</div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
      const rootEl = fixtureEl.querySelector('#root')
      const scrollSpy = new ScrollSpy(scrollSpyEl, {
        target: fixtureEl.querySelector('#ss-target')
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      onScrollStop(() => {
        expect(rootEl.classList.contains('active')).toEqual(true)
        expect(scrollSpy._activeTarget).toEqual(fixtureEl.querySelector('[href="#detail"]'))
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      }, scrollSpyEl)

      scrollSpyEl.scrollTo({ top: 350 })
    })

    it('should correctly select middle navigation option when large offset is used', done => {
      fixtureEl.innerHTML = [
        '<div id="header" style="height: 500px;"></div>',
        '<nav id="navigation" class="navbar">',
        ' <ul class="navbar-nav">',
        '   <li class="nav-item"><a class="nav-link active" id="one-link" href="#one">One</a></li>',
        '   <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
        '   <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
        ' </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        ' <div id="one" style="height: 500px;"></div>',
        ' <div id="two" style="height: 300px;"></div>',
        ' <div id="three" style="height: 10px;"></div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('#content')
      const scrollSpy = new ScrollSpy(fixtureEl, {
        target: '#navigation',
        offset: Manipulator.position(contentEl).top
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      onScrollStop(() => {
        expect(fixtureEl.querySelector('#one-link').classList.contains('active')).toEqual(false)
        expect(fixtureEl.querySelector('#two-link').classList.contains('active')).toEqual(true)
        expect(fixtureEl.querySelector('#three-link').classList.contains('active')).toEqual(false)
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      }, contentEl)

      contentEl.scrollTo({ top: 550 })
    })

    it('should add the active class to the correct element', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" style="overflow: auto; height: 50px">',
        '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        offset: 0,
        target: '.navbar'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()

      testElementIsActiveAfterScroll({
        elementSelector: '#a-1',
        targetSelector: '#div-1',
        contentEl,
        scrollSpy,
        spy,
        cb: () => {
          testElementIsActiveAfterScroll({
            elementSelector: '#a-2',
            targetSelector: '#div-2',
            contentEl,
            scrollSpy,
            spy,
            cb: () => done()
          })
        }
      })
    })

    it('should add to nav, the active class to the correct element (nav markup)', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <nav class="nav">',
        '    <a class="nav-link" id="a-1" href="#div-1">div 1</a>',
        '    <a class="nav-link" id="a-2" href="#div-2">div 2</a>',
        '  </nav>',
        '</nav>',
        '<div class="content" style="overflow: auto; height: 50px">',
        '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        offset: 0,
        target: '.navbar'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()

      testElementIsActiveAfterScroll({
        elementSelector: '#a-1',
        targetSelector: '#div-1',
        contentEl,
        scrollSpy,
        spy,
        cb: () => {
          testElementIsActiveAfterScroll({
            elementSelector: '#a-2',
            targetSelector: '#div-2',
            contentEl,
            scrollSpy,
            spy,
            cb: () => done()
          })
        }
      })
    })

    it('should add to list-group, the active class to the correct element (list-group markup)', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <div class="list-group">',
        '    <a class="list-group-item" id="a-1" href="#div-1">div 1</a>',
        '    <a class="list-group-item" id="a-2" href="#div-2">div 2</a>',
        '  </div>',
        '</nav>',
        '<div class="content" style="overflow: auto; height: 50px">',
        '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        offset: 0,
        target: '.navbar'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()

      testElementIsActiveAfterScroll({
        elementSelector: '#a-1',
        targetSelector: '#div-1',
        contentEl,
        scrollSpy,
        spy,
        cb: () => {
          testElementIsActiveAfterScroll({
            elementSelector: '#a-2',
            targetSelector: '#div-2',
            contentEl,
            scrollSpy,
            spy,
            cb: () => done()
          })
        }
      })
    })

    it('should clear selection if above the first section', done => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a id="one-link"   class="nav-link active" href="#one">One</a></li>',
        '    <li class="nav-item"><a id="two-link"   class="nav-link" href="#two">Two</a></li>',
        '    <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>',
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 150px; overflow-y: auto;">',
        '  <div id="spacer" style="height: 100px;"></div>',
        '  <div id="one" style="height: 100px;"></div>',
        '  <div id="two" style="height: 100px;"></div>',
        '  <div id="three" style="height: 100px;"></div>',
        '  <div id="spacer" style="height: 100px;"></div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('#content')
      // eslint-disable-next-line no-unused-vars
      const scrollSpy = new ScrollSpy(contentEl, {
        target: '#navigation'
      })

      onScrollStop(() => {
        const active = () => fixtureEl.querySelector('.active')

        expect(fixtureEl.querySelectorAll('.active').length).toEqual(1)
        expect(active().getAttribute('id')).toEqual('two-link')

        onScrollStop(() => {
          expect(active()).toBeNull()
          done()
        }, contentEl)
        contentEl.scrollTo({ top: 0 })
      }, contentEl)

      contentEl.scrollTo({ top: 201 })
    })

    it('should not clear selection if above the first section and first section is at the top', done => {
      fixtureEl.innerHTML = [
        '<div id="header" style="height: 500px;"></div>',
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a id="one-link" class="nav-link active" href="#one">One</a></li>',
        '    <li class="nav-item"><a id="two-link" class="nav-link" href="#two">Two</a></li>',
        '    <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>',
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 150px; overflow-y: auto;">',
        '  <div id="one" style="height: 100px;"></div>',
        '  <div id="two" style="height: 100px;"></div>',
        '  <div id="three" style="height: 100px;"></div>',
        '  <div id="spacer" style="height: 100px;"></div>',
        '</div>'
      ].join('')

      const startOfSectionTwo = 101
      const contentEl = fixtureEl.querySelector('#content')
      const scrollSpy = new ScrollSpy(contentEl, {
        target: '#navigation'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()

      onScrollStop(() => {
        const activeId = () => fixtureEl.querySelector('.active').getAttribute('id')

        expect(spy).toHaveBeenCalled()
        spy.calls.reset()
        expect(fixtureEl.querySelectorAll('.active').length).toEqual(1)
        expect(activeId()).toEqual('two-link')

        onScrollStop(() => {
          expect(fixtureEl.querySelectorAll('.active').length).toEqual(1)
          expect(spy).toHaveBeenCalled()
          expect(activeId()).toEqual('one-link')
          done()
        }, contentEl)

        contentEl.scrollTo({ top: 0 })
      }, contentEl)

      contentEl.scrollTo({ top: startOfSectionTwo })
    })

    it('should correctly select navigation element on backward scrolling when each target section height is 100%', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>',
        '    <li class="nav-item"><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>',
        '    <li class="nav-item"><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>',
        '    <li class="nav-item"><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>',
        '    <li class="nav-item"><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" style="overflow: auto; position: relative; height: 100px">',
        '  <div id="div-100-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-100-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>',
        '  <div id="div-100-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>',
        '  <div id="div-100-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>',
        '  <div id="div-100-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        offset: 0,
        target: '.navbar'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()

      testElementIsActiveAfterScroll({
        elementSelector: '#li-100-5',
        targetSelector: '#div-100-5',
        scrollSpy,
        spy,
        contentEl,
        cb() {
          contentEl.scrollTo({ top: 0 })
          testElementIsActiveAfterScroll({
            elementSelector: '#li-100-4',
            targetSelector: '#div-100-4',
            scrollSpy,
            spy,
            contentEl,
            cb() {
              contentEl.scrollTo({ top: 0 })
              testElementIsActiveAfterScroll({
                elementSelector: '#li-100-3',
                targetSelector: '#div-100-3',
                scrollSpy,
                spy,
                contentEl,
                cb() {
                  contentEl.scrollTo({ top: 0 })
                  testElementIsActiveAfterScroll({
                    elementSelector: '#li-100-2',
                    targetSelector: '#div-100-2',
                    scrollSpy,
                    spy,
                    contentEl,
                    cb() {
                      contentEl.scrollTo({ top: 0 })
                      testElementIsActiveAfterScroll({
                        elementSelector: '#li-100-1',
                        targetSelector: '#div-100-1',
                        scrollSpy,
                        spy,
                        contentEl,
                        cb: done
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const el = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(el)

      expect(ScrollSpy.getInstance(el)).not.toBeNull()

      scrollSpy.dispose()

      expect(ScrollSpy.getInstance(el)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should create a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, { target: '#navBar' })

      expect(ScrollSpy.getInstance(div)).not.toBeNull()
    })

    it('should create a scrollspy with given config', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, { rootMargin: '100px' })
      spyOn(ScrollSpy.prototype, 'constructor')
      expect(ScrollSpy.prototype.constructor).not.toHaveBeenCalledWith(div, { rootMargin: '100px' })

      const scrollspy = ScrollSpy.getInstance(div)
      expect(scrollspy).not.toBeNull()
      expect(scrollspy._config.rootMargin).toBe('100px')
    })

    it('should not re create a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div)

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock)

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
    })

    it('should call a scrollspy method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div)

      spyOn(scrollSpy, 'refresh')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, 'refresh')

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
      expect(scrollSpy.refresh).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = 'undefinedMethod'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error on protected method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = '_getConfig'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error if method "constructor" is being called', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = 'constructor'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div, { target: fixtureEl.querySelector('#navBar') })

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
      expect(ScrollSpy.getInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return null if there is no instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      expect(ScrollSpy.getInstance(div)).toEqual(null)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollspy = new ScrollSpy(div)

      expect(ScrollSpy.getOrCreateInstance(div)).toEqual(scrollspy)
      expect(ScrollSpy.getInstance(div)).toEqual(ScrollSpy.getOrCreateInstance(div, {}))
      expect(ScrollSpy.getOrCreateInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return new instance when there is no scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getInstance(div)).toEqual(null)
      expect(ScrollSpy.getOrCreateInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return new instance when there is no scrollspy instance with given configuration', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getInstance(div)).toEqual(null)
      const scrollspy = ScrollSpy.getOrCreateInstance(div, {
        offset: 1
      })
      expect(scrollspy).toBeInstanceOf(ScrollSpy)

      expect(scrollspy._config.offset).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollspy = new ScrollSpy(div, {
        offset: 1
      })
      expect(ScrollSpy.getInstance(div)).toEqual(scrollspy)

      const scrollspy2 = ScrollSpy.getOrCreateInstance(div, {
        offset: 2
      })
      expect(scrollspy).toBeInstanceOf(ScrollSpy)
      expect(scrollspy2).toEqual(scrollspy)

      expect(scrollspy2._config.offset).toEqual(1)
    })
  })

  describe('event handler', () => {
    it('should create scrollspy on window load event', () => {
      fixtureEl.innerHTML = [
        '<div id="nav"></div>' +
        '<div id="wrapper" data-bs-spy="scroll" data-bs-target="#nav"></div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#wrapper')

      window.dispatchEvent(createEvent('load'))

      expect(ScrollSpy.getInstance(scrollSpyEl)).not.toBeNull()
    })
  })
})
