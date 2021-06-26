import { clearFixture, getFixture } from '../../helpers/fixture'
import EventHandler from '../../../src/dom/event-handler'
import Swipe from '../../../src/util/swipe'

describe('Swipe', () => {
  const { Simulator, PointerEvent } = window
  const supportPointerEvent = Boolean(PointerEvent)

  let fixtureEl
  let swipeEl
  const clearPointerEvents = () => {
    window.PointerEvent = null
  }

  // Headless browser does not support touch events, so need to fake it
  // to test that touch events are add properly.
  const defineDocumentElementOntouchstart = () => {
    document.documentElement.ontouchstart = () => {}
  }

  const deleteDocumentElementOntouchstart = () => {
    delete document.documentElement.ontouchstart
  }

  const mockMaxTouchPointsGetter = val => Object.defineProperty(navigator, 'maxTouchPoints', { value: val, configurable: true })

  const mockSwipeGesture = (element, options = {}, type = 'touch') => {
    Simulator.setType(type)
    const _options = { ...{ deltaX: 0, deltaY: 0 }, ...options }

    Simulator.gestures.swipe(element, _options)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
    const cssStyle = [
      '<style>',
      '   #fixture .pointer-event {',
      '     touch-action: none;',
      '  }',
      '   #fixture div {',
      '     width: 500px;',
      '     height: 500px;',
      '  }',
      '</style>'
    ].join('')

    fixtureEl.innerHTML = '<div></div>' + cssStyle
    swipeEl = fixtureEl.querySelector('div')
  })

  afterEach(() => {
    clearFixture()
  })

  describe('constructor', () => {
    it('should add touch event listeners by default', () => {
      defineDocumentElementOntouchstart()

      spyOn(Swipe.prototype, '_initEvents').and.callThrough()
      const swipe = new Swipe(swipeEl)
      expect(swipe._initEvents).toHaveBeenCalled()
    })

    it('should not add touch event listeners if touch is not supported', () => {
      deleteDocumentElementOntouchstart()
      mockMaxTouchPointsGetter(0)

      spyOn(Swipe.prototype, '_initEvents').and.callThrough()
      const swipe = new Swipe(swipeEl)

      expect(swipe._initEvents).not.toHaveBeenCalled()
    })
  })

  describe('Config', () => {
    it('Test leftCallback', done => {
      const spyRight = jasmine.createSpy('spy')
      clearPointerEvents()
      defineDocumentElementOntouchstart()
      // eslint-disable-next-line no-unused-vars
      const swipe = new Swipe(swipeEl, {
        leftCallback: () => {
          expect(spyRight).not.toHaveBeenCalled()
          done()
        },
        rightCallback: spyRight
      })

      mockSwipeGesture(swipeEl, {
        pos: [300, 10],
        deltaX: -300
      })
    })

    it('Test rightCallback', done => {
      const spyLeft = jasmine.createSpy('spy')
      clearPointerEvents()
      defineDocumentElementOntouchstart()
      // eslint-disable-next-line no-unused-vars
      const swipe = new Swipe(swipeEl, {
        rightCallback: () => {
          expect(spyLeft).not.toHaveBeenCalled()
          done()
        },
        leftCallback: spyLeft
      })

      mockSwipeGesture(swipeEl, {
        pos: [10, 10],
        deltaX: 300
      })
    })

    it('Test endCallback', done => {
      clearPointerEvents()
      defineDocumentElementOntouchstart()
      let isFirstTime = true

      const callback = () => {
        if (isFirstTime) {
          isFirstTime = false
          return
        }

        done()
      }

      // eslint-disable-next-line no-unused-vars
      const swipe = new Swipe(swipeEl, {
        endCallback: callback
      })
      mockSwipeGesture(swipeEl, {
        pos: [10, 10],
        deltaX: 300
      })

      mockSwipeGesture(swipeEl, {
        pos: [300, 10],
        deltaX: -300
      })
    })
  })

  describe('Functionality on PointerEvents', () => {
    it('should allow swipeRight and call "rightCallback" with pointer events', done => {
      if (!supportPointerEvent) {
        expect().nothing()
        done()
        return
      }

      defineDocumentElementOntouchstart()
      // eslint-disable-next-line no-new
      new Swipe(swipeEl, { rightCallback: done })

      mockSwipeGesture(swipeEl, { deltaX: 300 }, 'pointer')
    })

    it('should allow swipeLeft and call "leftCallback" with pointer events', done => {
      if (!supportPointerEvent) {
        expect().nothing()
        done()
        return
      }

      defineDocumentElementOntouchstart()
      // eslint-disable-next-line no-new
      new Swipe(swipeEl, { leftCallback: done })

      mockSwipeGesture(swipeEl, {
        pos: [300, 10],
        deltaX: -300
      }, 'pointer')
    })
  })

  describe('Dispose', () => {
    it('should call EventHandler.off', () => {
      defineDocumentElementOntouchstart()
      spyOn(EventHandler, 'off').and.callThrough()
      const swipe = new Swipe(swipeEl)

      swipe.dispose()
      expect(EventHandler.off).toHaveBeenCalledWith(swipeEl, '.bs.swipe')
    })
  })

  describe('"isSupported" static', () => {
    it('should return "true" if "touchstart" exists in document element or "navigator.maxTouchPoints" are more than zero (0)', () => {
      mockMaxTouchPointsGetter(0)
      defineDocumentElementOntouchstart()

      expect(Swipe.isSupported()).toBeTrue()

      deleteDocumentElementOntouchstart()
      mockMaxTouchPointsGetter(1)
      expect(Swipe.isSupported()).toBeTrue()
    })

    it('should return "false" if "touchstart" not exists in document element and "navigator.maxTouchPoints" are  zero (0)', () => {
      mockMaxTouchPointsGetter(0)
      deleteDocumentElementOntouchstart()

      expect(Swipe.isSupported()).toBeFalse()
    })
  })
})
