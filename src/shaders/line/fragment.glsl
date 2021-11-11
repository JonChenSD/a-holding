
precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

varying float vRandom;

    void main()
        {
            vec4 textureColor = vec4(.47,.64,.47,1);
            textureColor.rgb *= vElevation * 2.0 + 0.5;
            gl_FragColor = textureColor;
            // gl_FragColor = vec4(.64,0,.47.vRandom)
        }