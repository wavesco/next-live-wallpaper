/** @type {import('next').NextConfig} */
const nextConfig = {transpilePackages:['three'], webpack: (config) => {config.module.rules.push({
    test: /\.(frag|vert|glsl)$/,
    type: 'asset/source',
    use: ['glslify-loader'],
    })
    return config
    }
}
module.exports = nextConfig
