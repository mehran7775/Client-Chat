import { mount } from "@vue/test-utils"
import app from "../app.vue"

describe("app page", () => {
  it("renders correctly", () => {
    const page = mount(app)

    expect(page.text()).toContain("مخاطب")
  })
})